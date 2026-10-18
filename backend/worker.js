import { parseInput, toEditorSession } from "../src/generation/contract.js";
import { providerRequest } from "./prompt.js";

const reply = (status, data, origin) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...(origin
        ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" }
        : {}),
    },
  });
async function sameSecret(a, b) {
  const hash = (text) =>
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  const [x, y] = await Promise.all([hash(a), hash(b)]);
  const xa = new Uint8Array(x),
    ya = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < xa.length; i++) diff |= xa[i] ^ ya[i];
  return diff === 0;
}
// Streaming byte limit also applies to chunked bodies, not only Content-Length.
export async function boundedText(response, limit) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks = [];
  let count = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      count += value.byteLength;
      if (count > limit) throw new Error("Body too large");
      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel();
    throw error;
  }
  const bytes = new Uint8Array(count);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}
export function makeWorker(fetcher = globalThis.fetch) {
  return {
    async fetch(request, env) {
      const origin = request.headers.get("Origin");
      if (!env.ALLOWED_ORIGIN || origin !== env.ALLOWED_ORIGIN)
        return reply(403, { error: "origin_not_allowed" });
      const url = new URL(request.url);
      if (url.pathname !== "/generate")
        return reply(404, { error: "not_found" }, origin);
      if (request.method === "OPTIONS")
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Max-Age": "600",
            Vary: "Origin",
          },
        });
      if (request.method !== "POST")
        return reply(405, { error: "method_not_allowed" }, origin);
      // Two gates: disabled public client config and this independently disabled server switch.
      if (env.GENERATION_ENABLED !== "true")
        return reply(503, { error: "generation_disabled" }, origin);
      if (
        !env.OPENAI_API_KEY ||
        !env.ACCESS_TOKEN ||
        env.ACCESS_TOKEN.length < 32 ||
        env.ACCESS_TOKEN.length > 256 ||
        !env.USAGE_GATE
      )
        return reply(503, { error: "configuration_required" }, origin);
      const auth = request.headers.get("Authorization") || "";
      if (
        auth.length > 270 ||
        !auth.startsWith("Bearer ") ||
        !(await sameSecret(auth.slice(7), env.ACCESS_TOKEN))
      )
        return reply(401, { error: "unauthorized" }, origin);
      if (!request.headers.get("Content-Type")?.startsWith("application/json"))
        return reply(400, { error: "json_required" }, origin);
      let input;
      try {
        input = parseInput(JSON.parse(await boundedText(request, 5000)));
      } catch {
        return reply(400, { error: "invalid_request" }, origin);
      }
      const body = JSON.stringify(providerRequest(input));
      if (new TextEncoder().encode(body).byteLength > 18000)
        return reply(400, { error: "input_too_large" }, origin);
      // Global reservation is atomic and persistent. Fail closed if the gate is unavailable.
      try {
        const gate = env.USAGE_GATE.get(
          env.USAGE_GATE.idFromName("impulso-global-v1"),
        );
        const result = await gate.fetch(
          new Request("https://quota.internal/reserve", { method: "POST" }),
        );
        if (result.status === 429)
          return reply(429, { error: "quota_exceeded" }, origin);
        if (!result.ok)
          return reply(503, { error: "quota_unavailable" }, origin);
      } catch {
        return reply(503, { error: "quota_unavailable" }, origin);
      }
      try {
        const response = await fetcher("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body,
          signal: AbortSignal.timeout(55000),
          redirect: "manual",
        });
        if (!response.ok) {
          await response.body?.cancel();
          return reply(
            response.status === 429 ? 429 : 502,
            { error: "provider_unavailable" },
            origin,
          );
        }
        const result = JSON.parse(await boundedText(response, 120000));
        if (result.status !== "completed")
          throw new Error("Incomplete response");
        const messages =
          result.output?.filter((item) => item.type === "message") ?? [];
        const content = messages.flatMap((item) => item.content ?? []);
        if (content.some((item) => item.type === "refusal"))
          throw new Error("Refusal");
        const texts = content.filter((item) => item.type === "output_text");
        if (texts.length !== 1) throw new Error("Missing structured output");
        const payload = JSON.parse(texts[0].text);
        toEditorSession(payload, input, "real"); // Independent validation, no partial response accepted.
        return reply(200, { session: payload }, origin);
      } catch (error) {
        return reply(
          ["AbortError", "TimeoutError"].includes(error.name) ? 504 : 502,
          { error: "invalid_or_incomplete_generation" },
          origin,
        );
      }
    },
  };
}
export default makeWorker();

// Uses a SQLite-backed Durable Object on Workers Free; never use eventually-consistent KV for spending quotas.
export class UsageGate {
  constructor(ctx) {
    this.ctx = ctx;
  }
  async fetch(request) {
    if (
      request.method !== "POST" ||
      new URL(request.url).pathname !== "/reserve"
    )
      return new Response(null, { status: 404 });
    const now = new Date(),
      day = now.toISOString().slice(0, 10),
      month = day.slice(0, 7);
    const allowed = await this.ctx.storage.transaction(async (storage) => {
      const value = (await storage.get("usage")) ?? {};
      const daily = value.day === day ? value.daily : 0,
        monthly = value.month === month ? value.monthly : 0;
      if (
        daily >= 5 ||
        monthly >= 50 ||
        now.getTime() - (value.last || 0) < 15000
      )
        return false;
      await storage.put("usage", {
        day,
        month,
        daily: daily + 1,
        monthly: monthly + 1,
        last: now.getTime(),
      });
      return true;
    });
    return new Response(null, { status: allowed ? 204 : 429 });
  }
}
