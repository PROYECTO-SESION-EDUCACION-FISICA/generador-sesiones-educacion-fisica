import test from "node:test";
import assert from "node:assert/strict";
import {
  createSession,
  totals,
  validate,
  validImport,
  competencies,
} from "../src/data.js";
import { documentBody, exportHtml } from "../src/document.js";
import { KEY, readSessions, writeSessions, mergeImport } from "../src/store.js";
class MemoryStorage {
  data = new Map();
  getItem(k) {
    return this.data.get(k) ?? null;
  }
  setItem(k, v) {
    this.data.set(k, v);
  }
}
test("la sesión de ejemplo suma 135 minutos y cumple su estructura", () => {
  const s = createSession();
  assert.deepEqual(totals(s), { inicio: 25, desarrollo: 95, cierre: 15 });
  assert.deepEqual(validate(s), []);
  assert.equal(s.grade, 3);
  assert.equal(s.criteria.length, 4);
  assert.equal(
    s.sequence.desarrollo.at(-1).name,
    "Circuito: mi secuencia gimnástica",
  );
});
test("las cinco plantillas tienen progresión por grado y son guardables", () => {
  const purposes = new Set();
  for (let grade = 1; grade <= 5; grade++) {
    const s = createSession(grade);
    assert.deepEqual(validate(s), []);
    assert.equal(s.performance, competencies[0].performances[grade]);
    assert.ok(validImport(s));
    purposes.add(s.precise);
  }
  assert.equal(purposes.size, 5);
});
test("rechaza tiempos incoherentes y actividades sin seguridad", () => {
  const s = createSession();
  s.sequence.desarrollo[0].time = 0;
  s.sequence.inicio[0].safety = "";
  assert.ok(validate(s).some((x) => x.includes("sumar")));
  assert.ok(validate(s).some((x) => x.includes("campos")));
});
test("guardado y lectura conservan todas las ediciones", () => {
  const storage = new MemoryStorage();
  const s = createSession();
  s.teacher = "Ana";
  s.sequence.desarrollo[0].execution = "Variante contextualizada";
  writeSessions(storage, [s]);
  assert.deepEqual(readSessions(storage), [s]);
  writeSessions(storage, []);
  assert.deepEqual(readSessions(storage), []);
});
test("una biblioteca corrupta no se reemplaza silenciosamente", () => {
  const storage = new MemoryStorage();
  storage.setItem(KEY, "no json");
  assert.throws(() => readSessions(storage));
  assert.equal(storage.getItem(KEY), "no json");
});
test("la importación conserva existentes y asigna nuevas identidades", () => {
  const s = createSession();
  const merged = mergeImport([s], [s]);
  assert.equal(merged.length, 2);
  assert.notEqual(merged[1].id, s.id);
  assert.deepEqual(merged[1].criteria, s.criteria);
  assert.throws(() => mergeImport([s], [{ title: "Inválida" }]));
});
test("la importación rechaza estructuras y valores no seguros", () => {
  for (const change of [
    (s) => (s.competency = 10),
    (s) => (s.grade = 2.5),
    (s) => (s.sequence.inicio[0].time = Infinity),
    (s) => (s.updatedAt = "bad"),
    (s) => (s.sequence = null),
    (s) => (s.criteria = ["uno"]),
    (s) => (s.status = "Desconocido"),
  ]) {
    const s = createSession();
    change(s);
    assert.equal(validImport(s), false);
  }
});
test("el documento exportado incluye todas las secciones y escapa HTML", () => {
  const s = createSession();
  s.title = "<img src=x onerror=alert(1)>";
  const html = exportHtml(s);
  assert.ok(html.includes("&lt;img"));
  assert.ok(!html.includes("<img src=x"));
  for (const section of [
    "Datos informativos",
    "Propósitos de aprendizaje",
    "Competencias y enfoques",
    "Secuencia didáctica",
    "Instrumento de evaluación",
  ])
    assert.ok(html.includes(section));
  for (const phase of Object.values(s.sequence))
    for (const activity of phase) assert.ok(html.includes(activity.name));
  assert.ok(documentBody(s).includes("95 MINUTOS"));
});


test("ambos formatos conservan todos los campos y las ediciones sin mutar la sesión", () => {
  const s = createSession();
  const fields = ["title", "institution", "teacher", "section", "date", "performance", "precise", "purpose", "evidence", "instrument", "transversal", "transversalCapacities", "transversalAttitude", "approach", "attitude", "adaptations", "notes"];
  for (const field of fields) s[field] = `MARCA_${field} <&>\nPregunta: ¿cómo?`;
  s.criteria = s.criteria.map((_, i) => `CRITERIO_${i} <&>`);
  for (const [phase, activities] of Object.entries(s.sequence)) for (const [i, a] of activities.entries()) for (const field of ["name", "organization", "materials", "execution", "technique", "safety"]) a[field] = `ACT_${phase}_${i}_${field} <&>\nSegunda indicación`;
  const before = structuredClone(s);
  for (const format of ["descriptive", "institutional"]) for (const checklist of ["individual", "group"]) {
    const html = exportHtml(s, { format, checklist, director: true });
    for (const field of fields) assert.ok(html.includes(`MARCA_${field} &lt;&amp;&gt;`), `${format}: ${field}`);
    for (const c of s.criteria) assert.ok(html.includes(c.replace("<&>", "&lt;&amp;&gt;")));
    for (const activities of Object.values(s.sequence)) for (const a of activities) for (const field of ["name", "organization", "materials", "execution", "technique", "safety"]) assert.ok(html.includes(a[field].split("\n")[0].replace("<&>", "&lt;&amp;&gt;")), `${format}: ${field}`);
    assert.ok(html.includes("V.º B.º de la dirección"));
    assert.ok(html.includes("Retroalimentación"));
    assert.ok(html.includes("135 de 135 minutos"));
    assert.ok(!html.includes("<&>"));
  }
  assert.deepEqual(s, before);
  s.purpose = "Cambio posterior del editor";
  for (const format of ["descriptive", "institutional"]) assert.ok(documentBody(s, {format}).includes(s.purpose));
  assert.ok(!documentBody(s).includes("V.º B.º de la dirección"));
});

test("la exportación advierte los tiempos incoherentes sin corregir datos guardados", () => {
  const s = createSession();
  s.duration = 140;
  for (const format of ["descriptive", "institutional"]) assert.ok(documentBody(s, {format}).includes("Revisar duración: las actividades suman 135 de 140 minutos"));
  assert.equal(s.duration, 140);
});
