import test from "node:test";
import assert from "node:assert/strict";
import { makeWorker, UsageGate, boundedText } from "../backend/worker.js";
import {
  providerRequest,
  MAX_OUTPUT_TOKENS,
  MODEL,
} from "../backend/prompt.js";
import { mockResponse } from "../src/generation/mock.js";
const input = {
  grade: 4,
  topic: "Fundamentos técnicos del atletismo",
  duration: 135,
  group: "",
};
const origin = "https://example.test";
const access = "test-only-private-access-code-12345";
function request(body = input, headers = {}, method = "POST") {
  return new Request("https://worker.test/generate", {
    method,
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
      ...headers,
    },
    ...(method === "POST" ? { body: JSON.stringify(body) } : {}),
  });
}
const env = () => ({
  ALLOWED_ORIGIN: origin,
  GENERATION_ENABLED: "true",
  OPENAI_API_KEY: "fake-test-only-key",
  ACCESS_TOKEN: access,
  USAGE_GATE: {
    idFromName: (s) => s,
    get: () => ({ fetch: async () => new Response(null, { status: 204 }) }),
  },
});
const result = (payload) =>
  Response.json({
    status: "completed",
    output: [
      {
        type: "message",
        content: [{ type: "output_text", text: JSON.stringify(payload) }],
      },
    ],
  });
test("backend: desactivado aunque existan credenciales", async () => {
  let calls = 0;
  const worker = makeWorker(async () => {
    calls++;
  });
  const r = await worker.fetch(request(), {
    ...env(),
    GENERATION_ENABLED: "false",
  });
  assert.equal(r.status, 503);
  assert.equal(calls, 0);
});
test("backend: origen, método, acceso y configuración bloquean llamadas", async () => {
  let calls = 0;
  const w = makeWorker(async () => {
    calls++;
  });
  assert.equal(
    (await w.fetch(request(input, { Origin: "https://evil.test" }), env()))
      .status,
    403,
  );
  assert.equal(
    (await w.fetch(request(input, { Authorization: "Bearer wrong" }), env()))
      .status,
    401,
  );
  assert.equal((await w.fetch(request(input, {}, "GET"), env())).status, 405);
  assert.equal(
    (await w.fetch(request(), { ...env(), OPENAI_API_KEY: "" })).status,
    503,
  );
  assert.equal(
    (await w.fetch(request(input, { "Content-Type": "text/plain" }), env()))
      .status,
    400,
  );
  assert.equal(calls, 0);
});
test("backend: preflight solo permite origen exacto", async () => {
  const r = await makeWorker().fetch(request(input, {}, "OPTIONS"), env());
  assert.equal(r.status, 204);
  assert.equal(r.headers.get("Access-Control-Allow-Origin"), origin);
});
test("backend: datos inválidos y tamaño excesivo no llegan al proveedor", async () => {
  const w = makeWorker(() => {
    throw Error("Must not fetch");
  });
  for (const body of [
    { ...input, grade: 8 },
    { ...input, group: "x".repeat(6000) },
  ])
    assert.equal((await w.fetch(request(body), env())).status, 400);
});
test("backend: cuota agotada o no disponible impide consumo", async () => {
  let calls = 0;
  const w = makeWorker(async () => {
    calls++;
  });
  for (const status of [429, 500]) {
    const e = env();
    e.USAGE_GATE.get = () => ({
      fetch: async () => new Response(null, { status }),
    });
    assert.equal(
      (await w.fetch(request(), e)).status,
      status === 429 ? 429 : 503,
    );
  }
  assert.equal(calls, 0);
});
test("backend: transporte simulado recibe el contrato y devuelve sesión validada", async () => {
  let calls = 0;
  const w = makeWorker(async (url, options) => {
    calls++;
    assert.equal(url, "https://api.openai.com/v1/responses");
    const body = JSON.parse(options.body);
    assert.equal(options.redirect, "manual");
      assert.equal(body.model, MODEL);
    assert.equal(body.max_output_tokens, 8000);
    assert.equal(body.store, false);
    assert.equal(body.text.format.strict, true);
    return result(mockResponse(input));
  });
  const r = await w.fetch(request(), env());
  assert.equal(r.status, 200);
  assert.equal(calls, 1);
  assert.equal((await r.json()).session.sequence.desarrollo.length, 4);
});
test("backend: respuestas inválidas, rechazo, truncado y error de proveedor no se aceptan ni reintentan", async () => {
  const bad = mockResponse(input);
  bad.sequence.inicio[0].time++;
  for (const response of [
    result(bad),
    Response.json({ status: "incomplete", output: [] }),
    Response.json({
      status: "completed",
      output: [{ type: "message", content: [{ type: "refusal" }] }],
    }),
    new Response("private provider error", { status: 500 }),
  ]) {
    let calls = 0;
    const r = await makeWorker(async () => {
      calls++;
      return response;
    }).fetch(request(), env());
    assert.equal(r.status, 502);
    assert.equal(calls, 1);
    assert.ok(!(await r.text()).includes("private provider error"));
  }
});
test("el lector acota cuerpos aunque no exista Content-Length", async () => {
  await assert.rejects(
    boundedText(new Response("x".repeat(100)), 50),
    /too large/,
  );
});
test("prompt limitado, sin herramientas ni títulos oficiales inventados", () => {
  const body = providerRequest({ ...input, group: "a".repeat(800) });
  assert.equal(body.max_output_tokens, MAX_OUTPUT_TOKENS);
  assert.equal(body.tools, undefined);
  assert.ok(new TextEncoder().encode(JSON.stringify(body)).length < 18000);
  assert.match(body.instructions, /SÍNTESIS ORIENTATIVAS/);
});
class Storage {
  value;
  queue = Promise.resolve();
  transaction(callback) {
    const result = this.queue.then(() =>
      callback({
        get: async () => structuredClone(this.value),
        put: async (k, v) => {
          this.value = structuredClone(v);
        },
      }),
    );
    this.queue = result.catch(() => {});
    return result;
  }
}
const reserve = (gate) =>
  gate.fetch(new Request("https://quota.internal/reserve", { method: "POST" }));
test("cuota: reservas concurrentes e instancias recreadas comparten almacenamiento", async () => {
  const storage = new Storage();
  const gate = new UsageGate({ storage });
  const statuses = (
    await Promise.all(Array.from({ length: 8 }, () => reserve(gate)))
  ).map((r) => r.status);
  assert.equal(statuses.filter((s) => s === 204).length, 1);
  assert.equal(storage.value.monthly, 1);
  assert.equal((await reserve(new UsageGate({ storage }))).status, 429);
});
test("cuota: límite diario y mensual y cambio de período", async () => {
  const storage = new Storage(),
    gate = new UsageGate({ storage });
  const today = new Date().toISOString().slice(0, 10);
  storage.value = {
    day: today,
    month: today.slice(0, 7),
    daily: 5,
    monthly: 5,
    last: 0,
  };
  assert.equal((await reserve(gate)).status, 429);
  storage.value = {
    day: "2000-01-01",
    month: today.slice(0, 7),
    daily: 0,
    monthly: 50,
    last: 0,
  };
  assert.equal((await reserve(gate)).status, 429);
  storage.value.month = "2000-01";
  assert.equal((await reserve(gate)).status, 204);
  assert.equal(storage.value.monthly, 1);
});

test("backend: rechaza redirecciones del proveedor sin reenviar la clave", async () => {
  let calls = 0;
  const worker = makeWorker(async (url, options) => {
    calls++;
    assert.equal(options.redirect, "manual");
    return new Response(null, {status: 302, headers: {Location: "https://untrusted.test"}});
  });
  assert.equal((await worker.fetch(request(), env())).status, 502);
  assert.equal(calls, 1);
});
