import test from "node:test";
import assert from "node:assert/strict";
import { generateSession } from "../src/generation/client.js";
import { parseInput, toEditorSession } from "../src/generation/contract.js";
import { mockResponse } from "../src/generation/mock.js";
import { totals, validate, competencies } from "../src/data.js";
import { readSessions, writeSessions } from "../src/store.js";
import { exportHtml } from "../src/document.js";
const input = {
  grade: 4,
  topic: "Fundamentos técnicos del atletismo",
  duration: 135,
  group: "",
};
const config = { realEnabled: true, endpoint: "https://example.test/generate" };
const accessCode = "test-only-private-access-code-12345";
test("el simulador no usa red y crea atletismo completo de 25/95/15 minutos", async () => {
  const session = await generateSession(input, {
    fetcher: () => {
      throw Error("Network forbidden");
    },
  });
  assert.deepEqual(totals(session), { inicio: 25, desarrollo: 95, cierre: 15 });
  assert.deepEqual(validate(session), []);
  assert.match(session.title, /Corremos/);
  assert.match(session.notes, /SIMULACIÓN LOCAL/);
  assert.equal(session.grade, 4);
  assert.equal(session.performance, competencies[0].performances[4]);
  assert.ok(
    session.sequence.desarrollo.every(
      (a) => !JSON.stringify(a).includes("gimnasia"),
    ),
  );
  assert.match(session.precise, /aceleración/);
  assert.equal(session.criteria.length, 4);
});
test("la simulación no disfraza otros temas, grados o duraciones", async () => {
  for (const value of [
    { ...input, grade: 3 },
    { ...input, duration: 90 },
    { ...input, topic: "Fundamentos de voleibol" },
  ])
    await assert.rejects(generateSession(value), /solo incluye el caso/);
});
test("entrada validada: grados, enteros, duración y longitudes", () => {
  for (const value of [
    { ...input, grade: 6 },
    { ...input, grade: 4.5 },
    { ...input, duration: 0 },
    { ...input, duration: 134.5 },
    { ...input, duration: 241 },
    { ...input, topic: "x" },
    { ...input, group: "a".repeat(801) },
    { ...input, endpoint: "https://evil.test" },
  ])
    assert.throws(() => parseInput(value));
});
test("la IA real no puede llamar una API con la configuración por defecto", async () => {
  let calls = 0;
  await assert.rejects(
    generateSession(input, {
      mode: "real",
      fetcher: () => {
        calls++;
      },
    }),
    /desactivada/,
  );
  assert.equal(calls, 0);
});
test("rechaza respuestas incompletas, claves adicionales y tiempos falsos", () => {
  for (const change of [
    (p) => p.criteria.pop(),
    (p) => p.sequence.desarrollo[0].time++,
    (p) => (p.sequence.inicio[0].safety = ""),
    (p) => (p.competency = 9),
    (p) => (p.grade = 5),
    (p) => (p.sequence.cierre = []),
    (p) => (p.sequence.inicio[0].time = 2.5),
  ]) {
    const payload = mockResponse(input);
    change(payload);
    assert.throws(() => toEditorSession(payload, input, "real"));
  }
});
test("normaliza metadatos sin incorporar contenido de la plantilla de gimnasia", () => {
  const s = toEditorSession(mockResponse(input), input, "real");
  assert.equal(s.teacher, "");
  assert.equal(s.institution, "");
  assert.equal(s.status, "Borrador");
  assert.match(s.notes, /PROPUESTA GENERADA CON IA/);
});
test("edición, guardado y recuperación y ambos formatos con una sesión generada", async () => {
  const s = await generateSession({
    ...input,
    group: "28 estudiantes; niveles diversos",
  });
  s.teacher = "Docente de prueba";
  s.criteria[0] =
    "Explica una corrección de braceo y dos medidas de seguridad.";
  let raw;
  const storage = {
    setItem: (key, value) => (raw = value),
    getItem: () => raw,
  };
  writeSessions(storage, [s]);
  assert.deepEqual(readSessions(storage), [s]);
  for (const format of ["descriptive", "institutional"]) {
    const html = exportHtml(s, { format, checklist: "group", director: true });
    assert.match(html, /Corremos con control/);
    assert.ok(html.includes(s.criteria[0]));
    assert.ok(html.includes("135"));
  }
  assert.match(s.adaptations, /28 estudiantes/);
});
test("cliente: error de red, cuota y JSON ilegible no incorporan sesiones", async () => {
  for (const [fetcher, pattern] of [
    [
      async () => {
        throw Error("offline");
      },
      /conectar/,
    ],
    [async () => new Response("", { status: 429 }), /cuota/],
    [async () => new Response("not json"), /ilegible/],
  ])
    await assert.rejects(
      generateSession(input, { mode: "real", config, accessCode, fetcher }),
      pattern,
    );
});
test("cliente: ruta real con respuesta simulada de transporte y autorización solo en memoria", async () => {
  let options;
  const s = await generateSession(input, {
    mode: "real",
    config,
    accessCode,
    fetcher: async (url, opts) => {
      options = opts;
      assert.equal(url, config.endpoint);
      return Response.json({ session: mockResponse(input) });
    },
  });
  assert.equal(options.headers.Authorization, `Bearer ${accessCode}`);
  assert.equal(JSON.parse(options.body).grade, 4);
  assert.match(s.notes, /PROPUESTA GENERADA/);
});
test("cliente: cancelación previa y endpoints inseguros no usan red", async () => {
  const c = new AbortController();
  c.abort();
  await assert.rejects(generateSession(input, { signal: c.signal }), {
    name: "AbortError",
  });
  for (const endpoint of [
    "http://example.test/generate",
    "https://secret:pass@example.test/generate",
    "https://example.test/generate?key=bad",
  ])
    await assert.rejects(
      generateSession(input, {
        mode: "real",
        config: { ...config, endpoint },
        accessCode,
        fetcher: () => {
          throw Error("Forbidden");
        },
      }),
      /HTTPS/,
    );
});
