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
export function documentBody(s) {
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
export const printStyles = `body{font:11pt Arial,sans-serif;color:#172d29;line-height:1.5;margin:30px}h1{font-size:24pt}h2{font-size:15pt;border-bottom:1px solid #aaa;margin-top:25px}h3{background:#eef3ed;padding:8px}h4{font-size:12pt}.doc-brand{font-size:9pt;letter-spacing:2px}.doc-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.doc-pair strong{font-size:10pt}.doc-pair p{margin:3px 0 10px;white-space:normal}table{border-collapse:collapse;width:100%;font-size:10pt}th,td{border:1px solid #aaa;padding:8px;text-align:left}tr{break-inside:avoid}footer{font-size:9pt;margin-top:30px;color:#555}h2,h3,h4{break-after:avoid}@page{size:A4;margin:16mm}@media print{body{margin:0}}`;
export function exportHtml(s) {
  return `<!doctype html><html lang="es"><head><meta charset="UTF-8"><title>${esc(s.title)}</title><style>${printStyles}</style></head><body>${documentBody(s)}</body></html>`;
}
