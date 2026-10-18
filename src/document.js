import {
  competencies,
  criterionTypes,
  phases,
  totals,
  SOURCE,
} from "./data.js";
export const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const para = (v) => esc(v).replace(/\n/g, "<br>");
const pair = (a, b) =>
  `<div class="doc-pair"><strong>${a}</strong><p>${para(b || "Por completar")}</p></div>`;
function descriptiveBody(s) {
  const t = totals(s);
  return `<article class="session-document"><div class="doc-brand">IMPULSO / EDUCACIÓN FÍSICA · SECUNDARIA</div><h1>${esc(s.title)}</h1><p class="doc-subtitle">Sesión de aprendizaje · ${s.grade}.º de secundaria · ${s.duration} minutos</p><h2>A. Datos informativos</h2><div class="doc-grid">${pair("Institución educativa", s.institution)}${pair("Docente", s.teacher)}${pair("Área curricular", "Educación Física")}${pair("Grado y sección", `${s.grade}.º de secundaria ${s.section}`)}${pair("Fecha", s.date)}${pair("Duración", `${s.duration} minutos (${Number((s.duration / 45).toFixed(2))} horas pedagógicas)`)}</div><h2>B. Propósitos de aprendizaje</h2>${pair("Competencia", competencies[s.competency].name)}${pair("Capacidades", competencies[s.competency].capacities.join("\n"))}${pair("Desempeño del grado · síntesis curricular editable", s.performance)}${pair("Desempeño precisado · propuesta docente", s.precise)}${pair("Propósito", s.purpose)}${pair("Evidencias", s.evidence)}${pair("Instrumento", s.instrument)}<table><thead><tr><th>Tipo</th><th>Criterio de evaluación</th></tr></thead><tbody>${s.criteria.map((c, i) => `<tr><td>${criterionTypes[i]}</td><td>${para(c)}</td></tr>`).join("")}</tbody></table><h2>C. Competencias y enfoques transversales</h2>${pair("Competencia transversal", s.transversal)}${pair("Capacidades", s.transversalCapacities)}${pair("Actuación observable", s.transversalAttitude)}${pair("Enfoques transversales", s.approach)}${pair("Actitudes observables", s.attitude)}<h2>D. Secuencia didáctica</h2>${Object.entries(
    phases,
  )
    .map(
      ([key, label]) =>
        `<h3 class="doc-phase">${label.toUpperCase()} · ${t[key]} MINUTOS</h3>${s.sequence[key].map((a, i) => `<section class="doc-activity"><h4>${i + 1}. ${esc(a.name)} <span>· ${a.time} min</span></h4>${pair("Organización", a.organization)}${pair("Materiales", a.materials)}${pair("Ejecución", a.execution)}${pair("Indicaciones y correcciones técnicas", a.technique)}${pair("Medidas de seguridad", a.safety)}</section>`).join("")}`,
    )
    .join(
      "",
    )}<h2>E. Atención a la diversidad y previsiones</h2>${pair("Adaptaciones", s.adaptations)}${pair("Observaciones del docente", s.notes)}<h2>Instrumento de evaluación · ${esc(s.instrument)}</h2><p>Estudiante: __________________________ Fecha: __________</p><table><thead><tr><th>Criterio</th><th>Sí</th><th>En proceso</th><th>Observación / siguiente paso</th></tr></thead><tbody>${s.criteria.map((c) => `<tr><td>${para(c)}</td><td>□</td><td>□</td><td> </td></tr>`).join("")}</tbody></table><p>Autoevaluación: ¿qué logré?, ¿qué ajuste me ayudó?, ¿qué mejoraré en la próxima sesión?</p><footer>Referencia: <a href="${SOURCE}">MINEDU · Programa Curricular de Educación Secundaria</a>, área de Educación Física. <a href="https://www.minedu.gob.pe/curriculo/pdf/curriculo-nacional-de-la-educacion-basica.pdf">CNEB</a>. Los desempeños se presentan como síntesis orientativas; las precisiones y actividades son propuestas docentes que requieren contextualización.</footer></article>`;
}
export const printStyles = `
@page { size: A4; margin: 16mm; }
* { box-sizing: border-box; }
body { margin: 0; font: 11pt Arial, sans-serif; color: #172d29; line-height: 1.4; }
.session-document { max-width: 100%; overflow-wrap: anywhere; }
h1 { font-size: 23pt; line-height: 1.2; margin: 10pt 0 6pt; }
h2 { font-size: 14pt; border-bottom: 1px solid #aaa; margin: 12pt 0 7pt; padding-bottom: 4pt; }
h3 { font-size: 11pt; background: #eef3ed; padding: 6pt; margin: 10pt 0 7pt; }
h4 { font-size: 11pt; margin: 8pt 0 5pt; }
h1, h2, h3, h4 { break-after: avoid; page-break-after: avoid; }
p { margin: 4pt 0 6pt; orphans: 3; widows: 3; }
.doc-brand { font-size: 9pt; letter-spacing: 2px; }
.doc-subtitle { margin-bottom: 10pt; }
.doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5pt 12pt; }
.doc-pair strong { display: block; font-size: 10pt; break-after: avoid; }
.doc-pair p { margin: 2pt 0 7pt; white-space: normal; }
.doc-activity, .doc-pair, table, tbody, .sequence-row { break-inside: auto; page-break-inside: auto; }
table { border-collapse: collapse; width: 100%; table-layout: fixed; font-size: 10pt; margin: 8pt 0 10pt; }
th, td { border: 1px solid #aaa; padding: 6pt; text-align: left; vertical-align: top; overflow-wrap: anywhere; height: auto; }
th { background: #eef3ed; }
thead { display: table-header-group; }
tr { break-inside: avoid; page-break-inside: avoid; }
.sequence-row { break-inside: auto; page-break-inside: auto; }
tbody > tr > th[scope=row] { width: 30%; }
.sequence-table tbody > tr > th[scope=row] { width: auto; }
.sequence-row p { margin: 0 0 6pt; break-inside: auto; }
.sequence-row h4 { margin: 0 0 5pt; }
.phase-summary { break-after: avoid; }
.doc-checklist { break-before: auto; page-break-before: auto; break-after: avoid; }
.doc-feedback { break-inside: avoid; break-after: avoid; padding-top: 6pt; font-size: 11pt; }
.checklist-ending { break-inside: avoid; page-break-inside: avoid; }
.checklist-footer-row > td { border: 0; padding: 0; height: auto; }
.checklist-table, .group-checklist { break-after: avoid; }
.checklist-table tr:last-child, .group-checklist tr:nth-last-child(-n+3) { break-after: avoid; }
.checklist-table td:nth-child(2), .checklist-table td:nth-child(3), .checklist-table th:nth-child(2), .checklist-table th:nth-child(3) { text-align: center; }
.check-box { display: inline-block; width: 3mm; height: 3mm; border: 1pt solid #333; vertical-align: middle; }
.group-checklist td { height: 7mm; }
.doc-closing { break-inside: avoid; page-break-inside: avoid; break-before: avoid; page-break-before: avoid; }
.doc-signatures { display: flex; justify-content: space-around; gap: 12pt; margin-top: 4mm; break-inside: avoid; }
.doc-signatures p { text-align: center; margin: 0; }
footer { font-size: 8pt; line-height: 1.35; margin-top: 6pt; color: #555; }
.duration-warning { border: 1px solid #9b4e27; padding: 6pt; }
.institutional h1 { font-size: 20pt; }
`;

export function exportHtml(s, options = {}) {
  return `<!doctype html><html lang="es"><head><meta charset="UTF-8"><title>${esc(s.title)}</title><style>${printStyles}</style></head><body>${documentBody(s, options)}</body></html>`;
}


// Presentation settings never enter the saved session schema.
export function durationSummary(s) {
  const minutes = Object.values(totals(s)).reduce((a, b) => a + b, 0);
  return { minutes, valid: minutes === Number(s.duration) };
}
const rows = (entries) => `<table><tbody>${entries.map(([label, value]) => `<tr><th scope="row">${esc(label)}</th><td>${para(value || "Por completar")}</td></tr>`).join("")}</tbody></table>`;
const criteriaTable = (s) => `<table><thead><tr><th scope="col">Tipo</th><th scope="col">Criterio de evaluación</th></tr></thead><tbody>${s.criteria.map((c, i) => `<tr><th scope="row">${esc(criterionTypes[i])}</th><td>${para(c)}</td></tr>`).join("")}</tbody></table>`;
const activityText = (a, i) => `<h4>${i + 1}. ${esc(a.name)}</h4>${[["Organización", a.organization], ["Materiales", a.materials], ["Ejecución", a.execution], ["Indicaciones y correcciones técnicas", a.technique], ["Medidas de seguridad", a.safety]].map(([label, value]) => `<p><strong>${label}:</strong> ${para(value || "Por completar")}</p>`).join("")}`;
function checklist(s, options, closing = "") {
  const group = options.checklist === "group";
  const feedback = `<div class="doc-feedback"><p>Observaciones: __________________________________________________</p><p>Retroalimentación: _________________________________________________</p><p>Autoevaluación: ¿qué logré?, ¿qué ajuste me ayudó?, ¿qué mejoraré en la próxima sesión?</p>${closing}</div>`;
  const cols = group
    ? `<col style="width:28%">${s.criteria.map(() => '<col style="width:8%">').join("")}<col style="width:40%">`
    : '<col style="width:48%"><col style="width:9%"><col style="width:13%"><col style="width:30%">';
  const headers = group
    ? `<th scope="col">Estudiante</th>${s.criteria.map((_, i) => `<th scope="col">C${i + 1}</th>`).join("")}<th scope="col">Observaciones / retroalimentación</th>`
    : '<th scope="col">Criterio de evaluación</th><th scope="col">Sí</th><th scope="col">En proceso</th><th scope="col">Observación / siguiente paso</th>';
  const entries = group
    ? Array.from({ length: 10 }, () => `<tr><td>________________</td>${s.criteria.map(() => '<td> </td>').join("")}<td> </td></tr>`)
    : s.criteria.map(c => `<tr><td>${para(c)}</td><td><span class="check-box" aria-label="Casilla Sí"></span></td><td><span class="check-box" aria-label="Casilla En proceso"></span></td><td> </td></tr>`);
  // Keep a small part of the instrument with its closing fields, never the whole
  // instrument. Oversized groups can still flow according to the browser engine.
  const tailCount = group ? 3 : 1;
  const table = `<table class="${group ? "group-checklist" : "checklist-table"}"><colgroup>${cols}</colgroup><thead><tr>${headers}</tr></thead><tbody>${entries.slice(0, -tailCount).join("")}</tbody><tbody class="checklist-ending">${entries.slice(-tailCount).join("")}<tr class="checklist-footer-row"><td colspan="${group ? s.criteria.length + 2 : 4}">${feedback}</td></tr></tbody></table>`;
  return `<section class="doc-checklist"><h2>F. Instrumento de evaluación · ${esc(s.instrument)}</h2><h3>Lista de cotejo ${group ? "grupal" : "individual"}</h3><p>${group ? "Grado y sección: __________________________" : "Estudiante: __________________________"} Fecha: __________</p>${group ? `<p>Registrar por criterio: Sí / En proceso. C1–C4 corresponden a los cuatro criterios siguientes.</p>${criteriaTable(s)}` : ""}${table}</section>`;
}
function institutionalBody(s) {
  const t = totals(s), c = competencies[s.competency];
  return `<article class="session-document institutional"><div class="doc-brand">IMPULSO / EDUCACIÓN FÍSICA · SECUNDARIA</div><h1>${esc(s.title)}</h1><p class="doc-subtitle">Sesión de aprendizaje · ${s.grade}.º de secundaria · ${s.duration} minutos</p><h2>A. Datos informativos</h2>${rows([["Institución educativa",s.institution],["Docente",s.teacher],["Área curricular","Educación Física"],["Grado",`${s.grade}.º de secundaria`],["Sección",s.section],["Fecha",s.date],["Duración",`${s.duration} minutos (${Number((s.duration / 45).toFixed(2))} horas pedagógicas)`],["Título de la sesión",s.title]])}<h2>B. Propósitos de aprendizaje</h2>${rows([["Competencia",c.name],["Capacidades",c.capacities.join("\n")],["Desempeño del grado · síntesis curricular editable",s.performance],["Desempeño precisado · propuesta docente",s.precise],["Propósito",s.purpose],["Evidencias",s.evidence],["Instrumento de evaluación",s.instrument]])}${criteriaTable(s)}<h2>C. Competencias y enfoques transversales</h2>${rows([["Competencia transversal",s.transversal],["Capacidades",s.transversalCapacities],["Actuación observable",s.transversalAttitude]])}${rows([["Enfoques transversales",s.approach],["Actitudes observables",s.attitude]])}<h2>D. Secuencia didáctica</h2><table class="sequence-table"><colgroup><col style="width:15%"><col style="width:75%"><col style="width:10%"></colgroup><thead><tr><th scope="col">Momento</th><th scope="col">Procesos pedagógicos y actividades</th><th scope="col">Tiempo</th></tr></thead><tbody>${Object.entries(phases).map(([key,label]) => `<tr class="phase-summary"><th scope="row">${esc(label)}</th><td>Total del momento</td><td>${t[key]} min</td></tr>${s.sequence[key].map((a,i) => `<tr class="sequence-row"><th scope="row">${esc(label)}</th><td>${activityText(a,i)}</td><td>${a.time} min</td></tr>`).join("")}`).join("")}</tbody></table><h2>E. Atención a la diversidad y previsiones</h2>${rows([["Adaptaciones",s.adaptations],["Observaciones del docente",s.notes]])}</article>`;
}
export function documentBody(s, options = {}) {
  let body = options.format === "institutional" ? institutionalBody(s) : descriptiveBody(s);
  // Keep the existing descriptive presentation and replace only the shared instrument.
  if (options.format !== "institutional") {
    body = body.replace(/<h2>Instrumento de evaluación[\s\S]*?(?=<footer>)/, "");
  }
  const signatures = `<div class="doc-signatures"><p>________________________<br>Firma del docente</p>${options.director ? '<p>________________________<br>V.º B.º de la dirección</p>' : ""}</div>`;
  const descriptiveReference = body.match(/<footer>[\s\S]*?<\/footer>/)?.[0] || "";
  body = body.replace(/<footer>[\s\S]*?<\/footer>/, "");
  const reference = options.format === "institutional" ? `<footer>Referencia: <a href="${SOURCE}">MINEDU · Programa Curricular de Educación Secundaria</a>. Los desempeños son síntesis orientativas; las precisiones y actividades son propuestas docentes que requieren contextualización.</footer>` : descriptiveReference;
  const summary = durationSummary(s);
  const notice = `<p class="doc-duration ${summary.valid ? "" : "duration-warning"}">${summary.valid ? "Tiempo verificado" : "Revisar duración"}: las actividades suman ${summary.minutes} de ${esc(s.duration)} minutos.</p>`;
  return body.replace("</article>", `${notice}${checklist(s, options, `<section class="doc-closing">${signatures}${reference}</section>`)}</article>`);
}

