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
export const printStyles = `body{font:11pt Arial,sans-serif;color:#172d29;line-height:1.5;margin:30px}h1{font-size:24pt}h2{font-size:15pt;border-bottom:1px solid #aaa;margin-top:25px}h3{background:#eef3ed;padding:8px}h4{font-size:12pt}.doc-brand{font-size:9pt;letter-spacing:2px}.doc-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.doc-pair strong{font-size:10pt}.doc-pair p{margin:3px 0 10px;white-space:normal}table{border-collapse:collapse;width:100%;font-size:10pt}th,td{border:1px solid #aaa;padding:8px;text-align:left}tr{break-inside:avoid;page-break-inside:avoid}thead{display:table-header-group}td,th{vertical-align:top;overflow-wrap:anywhere}table{table-layout:fixed}tbody>tr>th[scope=row]{width:30%}.sequence-table tbody>tr>th[scope=row]{width:auto}p{orphans:3;widows:3}.sequence-row{break-inside:avoid;page-break-inside:avoid}.sequence-row p{break-inside:avoid}.sequence-row h4{margin:0 0 6px}.phase-summary{break-after:avoid}.doc-signatures{display:flex;justify-content:space-around;gap:20px;margin-top:25mm;break-inside:avoid}.doc-signatures p{text-align:center}.doc-checklist{break-before:page}.group-checklist td{height:9mm}.duration-warning{border:1px solid #9b4e27;padding:8px}.session-document{max-width:100%;overflow-wrap:anywhere}.institutional h1{font-size:20pt}.institutional table p{margin:0 0 7px}footer{font-size:9pt;margin-top:30px;color:#555}h2,h3,h4{break-after:avoid}@page{size:A4;margin:16mm}@media print{body{margin:0}}`;
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
function checklist(s, options) {
  const group = options.checklist === "group";
  return `<section class="doc-checklist"><h2>F. Instrumento de evaluación · ${esc(s.instrument)}</h2><h3>Lista de cotejo ${group ? "grupal" : "individual"}</h3><p>${group ? "Grado y sección: __________________________" : "Estudiante: __________________________"} Fecha: __________</p>${group ? `<p>Registrar por criterio: Sí / En proceso. C1–C4 corresponden a los cuatro criterios siguientes.</p>${criteriaTable(s)}<table class="group-checklist"><colgroup><col style="width:28%">${s.criteria.map(() => '<col style="width:8%">').join("")}<col style="width:40%"></colgroup><thead><tr><th scope="col">Estudiante</th>${s.criteria.map((_, i) => `<th scope="col">C${i + 1}</th>`).join("")}<th scope="col">Observaciones / retroalimentación</th></tr></thead><tbody>${Array.from({length: 10}, () => `<tr><td>________________</td>${s.criteria.map(() => '<td> </td>').join("")}<td> </td></tr>`).join("")}</tbody></table>` : `<table><thead><tr><th scope="col">Criterio</th><th scope="col">Sí</th><th scope="col">En proceso</th><th scope="col">Observación / siguiente paso</th></tr></thead><tbody>${s.criteria.map(c => `<tr><td>${para(c)}</td><td>□</td><td>□</td><td> </td></tr>`).join("")}</tbody></table>`}<p>Observaciones: __________________________________________________</p><p>Retroalimentación: _________________________________________________</p><p>Autoevaluación: ¿qué logré?, ¿qué ajuste me ayudó?, ¿qué mejoraré en la próxima sesión?</p></section>`;
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
  const reference = options.format === "institutional" ? `<footer>Referencia: <a href="${SOURCE}">MINEDU · Programa Curricular de Educación Secundaria</a>. Los desempeños son síntesis orientativas; las precisiones y actividades son propuestas docentes que requieren contextualización.</footer>` : "";
  const summary = durationSummary(s);
  const notice = `<p class="doc-duration ${summary.valid ? "" : "duration-warning"}">${summary.valid ? "Tiempo verificado" : "Revisar duración"}: las actividades suman ${summary.minutes} de ${esc(s.duration)} minutos.</p>`;
  return body.replace("</article>", `${notice}${checklist(s, options)}${signatures}${reference}</article>`);
}
