import test from "node:test";
import assert from "node:assert/strict";
import { createFutsalSession } from "../src/templates/futsal.js";
import {
  competencies,
  createSession,
  totals,
  validate,
  validImport,
} from "../src/data.js";
import { writeSessions, readSessions } from "../src/store.js";
import { documentBody, exportHtml } from "../src/document.js";

test("futsal: sesión completa de quinto con duración exacta y referencia curricular existente", () => {
  const s = createFutsalSession();
  assert.equal(s.grade, 5);
  assert.equal(s.duration, 135);
  assert.deepEqual(totals(s), { inicio: 25, desarrollo: 95, cierre: 15 });
  assert.deepEqual(validate(s), []);
  assert.equal(validImport(s), true);
  assert.equal(s.competency, 0);
  assert.equal(s.performance, competencies[0].performances[5]);
  assert.equal(s.instrument, "Lista de cotejo");
  assert.equal(s.criteria.length, 4);
  assert.equal(s.sequence.desarrollo.length, 5);
  for (const activities of Object.values(s.sequence))
    for (const a of activities) {
      for (const field of [
        "name",
        "organization",
        "materials",
        "execution",
        "technique",
        "safety",
      ])
        assert.ok(a[field].trim().length > 10, `${a.name}: ${field}`);
      assert.ok(Number.isInteger(a.time) && a.time > 0);
    }
  assert.match(s.precise, /ambos pies/);
  assert.match(s.criteria[2], /segundo intento/);
  assert.match(s.notes, /no son citas textuales/);
});

test("futsal: las nuevas sesiones son independientes y no modifican gimnasia", () => {
  const gym = createSession(3),
    before = structuredClone(gym);
  const first = createFutsalSession(),
    second = createFutsalSession();
  assert.notEqual(first.id, second.id);
  first.criteria[0] = "Criterio editado";
  first.sequence.desarrollo[0].name = "Actividad editada";
  assert.notEqual(first.criteria[0], second.criteria[0]);
  assert.notEqual(
    first.sequence.desarrollo[0].name,
    second.sequence.desarrollo[0].name,
  );
  assert.deepEqual(gym, before);
  assert.equal(createSession(5).topic, "Gimnasia");
});

test("futsal: se editan y recuperan los criterios, actividades y datos del docente", () => {
  const s = createFutsalSession();
  s.teacher = "Docente de prueba";
  s.institution = "Institución de prueba";
  s.criteria[0] =
    "Explica una elección de superficie de contacto y dos acuerdos de seguridad.";
  s.sequence.desarrollo[0].technique = "Corrección adaptada por el docente.";
  let raw;
  const storage = { setItem: (k, v) => (raw = v), getItem: () => raw };
  writeSessions(storage, [createSession(), s]);
  assert.deepEqual(readSessions(storage)[1], s);
  assert.deepEqual(validate(readSessions(storage)[1]), []);
});

test("futsal: ambos formatos y listas de cotejo conservan todos los contenidos", () => {
  const s = createFutsalSession(),
    before = structuredClone(s);
  for (const format of ["descriptive", "institutional"])
    for (const checklist of ["individual", "group"]) {
      const html = exportHtml(s, { format, checklist });
      assert.ok(html.includes(s.title));
      assert.ok(html.includes(s.precise));
      assert.ok(html.includes("135 de 135 minutos"));
      for (const criterion of s.criteria) assert.ok(html.includes(criterion));
      for (const activities of Object.values(s.sequence))
        for (const a of activities)
          for (const field of [
            "name",
            "organization",
            "materials",
            "execution",
            "technique",
            "safety",
          ])
            assert.ok(
              html.includes(a[field]),
              `${format}: ${a.name} / ${field}`,
            );
      assert.ok(
        documentBody(s, { format, checklist }).includes("Retroalimentación"),
      );
    }
  assert.deepEqual(s, before);
});
