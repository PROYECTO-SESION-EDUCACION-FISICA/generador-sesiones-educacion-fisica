import {
  createSession,
  competencies,
  criterionTypes,
  phases,
  totals,
  validate,
  validImport,
  SOURCE,
} from "./data.js";
import { esc, documentBody, exportHtml, durationSummary } from "./document.js";
import { readSessions, writeSessions, mergeImport } from "./store.js";
import { generateSession } from "./generation/client.js";
import { generationConfig } from "./generation/config.js";
let generationController = null;
const icons = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4zM20 4h-4a3 3 0 0 0-3 3v14a4 4 0 0 1 4-2h3z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  download: '<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  folder:
    '<path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  settings:
    '<path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="3"/><circle cx="16" cy="17" r="3"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  file: '<path d="M14 3H5v18h14V8zM14 3v5h5M8 12h8M8 16h6"/>',
  back: '<path d="M19 12H5m5-5-5 5 5 5"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12"/><circle cx="12" cy="12" r="3"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3h.01"/>',
};
const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.file}</svg>`;
let sessions = [],
  loadError = false;
try {
  sessions = readSessions(localStorage);
  writeSessions(localStorage, sessions);
} catch {
  loadError = true;
}
let view = "home",
  draft = null,
  dirty = false,
  tab = 0,
  preview = false,
  exportOptions = { format: "descriptive", checklist: "individual", director: false },
  query = "",
  gradeFilter = "",
  statusFilter = "",
  folderFilter = "",
  sort = "recent",
  favoriteOnly = false;
const app = document.querySelector("#app"),
  modal = document.querySelector("#modal");
function toast(msg) {
  const el = document.querySelector("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 4500);
}
function persist(next) {
  if (loadError) {
    toast(
      "El almacenamiento no está disponible. Descarga un respaldo antes de continuar.",
    );
    return false;
  }
  try {
    writeSessions(localStorage, next);
    sessions = next;
    return true;
  } catch {
    toast(
      "No se pudo guardar: el almacenamiento está lleno o bloqueado. Descarga un respaldo JSON.",
    );
    return false;
  }
}
function dialog(title, body, actions) {
  modal.innerHTML = `<div class="dialog-head"><h2>${title}</h2><button class="icon-btn" data-action="close-modal" aria-label="Cerrar">${icon("close")}</button></div>${body}<div class="dialog-actions">${actions}</div>`;
  modal.showModal();
}
function discard(action) {
  if (!dirty) {
    action();
    return;
  }
  dialog(
    "¿Salir sin guardar?",
    "<p>Hay cambios pendientes. Puedes volver al editor para guardarlos.</p>",
    '<button class="btn" data-action="close-modal">Seguir editando</button><button class="btn danger" id="discard-confirm">Salir sin guardar</button>',
  );
  document.querySelector("#discard-confirm").onclick = () => {
    modal.close();
    dirty = false;
    action();
  };
}
const athlete = `<svg viewBox="0 0 400 250" class="athlete" aria-hidden="true"><defs><pattern id="court" width="35" height="35" patternUnits="userSpaceOnUse"><path d="M35 0H0v35" fill="none" stroke="#ffffff" stroke-opacity=".09"/></pattern></defs><rect width="400" height="250" fill="url(#court)"/><circle cx="270" cy="125" r="104" fill="none" stroke="#c8dfa0" stroke-opacity=".3"/><circle cx="270" cy="125" r="77" fill="none" stroke="#c8dfa0" stroke-opacity=".15"/><path d="M135 220h235" stroke="#b9d58b" stroke-opacity=".5"/><g stroke-linecap="round" stroke-linejoin="round"><path d="m256 115-19 42 45 47" fill="none" stroke="#e0edc5" stroke-width="22"/><path d="m253 117 51 34 51-17" fill="none" stroke="#c1d68e" stroke-width="20"/><path d="m241 104-49-9-35-41" stroke="#e0edc5" stroke-width="15" fill="none"/><path d="m254 104 39-44 42-20" stroke="#e0edc5" stroke-width="15" fill="none"/><path d="m244 102 14 29" stroke="#f5a36f" stroke-width="35"/><circle cx="233" cy="68" r="17" fill="#e0edc5"/><path d="m220 56 11-7 16 6" stroke="#142f29" stroke-width="9" fill="none"/></g><circle cx="139" cy="161" r="5" fill="#c7df93"/><path d="M130 161h18m-9-9v18" stroke="#c7df93"/><path d="m350 200 8-12 8 12z" fill="none" stroke="#c7df93"/></svg>`;
function shell() {
  return `<aside class="sidebar"><a class="brand" href="#" data-action="home"><span class="brand-mark">ϟ</span>impulso<span class="brand-dot">.</span></a><div class="brand-caption">PLANIFICA. MUEVE. INSPIRA.</div><div class="nav-label">TU ESPACIO DOCENTE</div><nav aria-label="Principal"><button class="nav-item ${view === "home" ? "active" : ""}" data-action="home">${icon("grid")}Vista general</button><button class="nav-item ${view === "library" && !favoriteOnly ? "active" : ""}" data-action="library">${icon("book")}Mis sesiones<span class="nav-count">${sessions.length}</span></button><button class="nav-item ${favoriteOnly ? "active" : ""}" data-action="favorites">${icon("star")}Favoritas</button><button class="nav-item ${view === "curriculum" ? "active" : ""}" data-action="curriculum">${icon("folder")}Guía curricular</button></nav><div class="sidebar-tip"><span class="tip-icon">✦</span><h3>Cada movimiento<br>es un aprendizaje.</h3><p>Diseña experiencias que conecten el cuerpo y la mente.</p><button data-action="new">Crear una sesión ${icon("arrow")}</button></div><div class="sidebar-bottom"><button class="nav-item" data-action="backup">${icon("download")}Respaldar biblioteca</button><button class="nav-item" data-action="help">${icon("help")}Ayuda y almacenamiento</button><div class="profile"><span class="avatar">EF</span><div><strong>Mi espacio docente</strong><small>Educación Física · Perú</small></div><span class="online-dot"></span></div></div></aside><div class="workspace"><header class="topbar"><button class="mobile-brand" data-action="home">ϟ impulso.</button><div class="breadcrumb">Mi espacio <span>/</span> <strong>${{ home: "Vista general", library: favoriteOnly ? "Favoritas" : "Mis sesiones", editor: "Editor de sesión", curriculum: "Guía curricular" }[view]}</strong></div><div class="topbar-right"><span class="peru"><i></i> Perú</span><span class="top-divider"></span><span class="curriculum-pill">CNEB · Secundaria</span><button class="avatar small" data-action="help" aria-label="Información del espacio docente">EF</button></div></header><main id="main">${loadError ? '<div class="alert">No se pudo leer o guardar la biblioteca local. No se ha sobrescrito el contenido anterior. Puedes importar un respaldo o revisar los permisos del navegador.</div>' : ""}${view === "home" ? home() : view === "library" ? library() : view === "curriculum" ? curriculum() : editor()}</main><footer class="app-footer"><span>Hecho para docentes que ponen el aprendizaje en movimiento.</span><span>Educación Física · Secundaria · Perú</span></footer></div>`;
}
function render() {
  app.innerHTML = shell();
}
function home() {
  const ready = sessions.filter((s) => s.status === "Lista para usar").length;
  const minutes = sessions
    .filter((s) => s.status !== "Archivada")
    .reduce((a, s) => a + s.duration, 0);
  return `<section class="page-heading"><div><p class="eyebrow">ENSEÑAR TAMBIÉN ES INSPIRAR</p><h1>Tu próxima gran sesión<br>empieza aquí<span class="orange">.</span></h1><p>Menos tiempo planificando. Más tiempo poniendo a tus estudiantes en movimiento.</p></div><button class="btn primary" data-action="new">${icon("plus")}Nueva sesión</button></section><section class="hero"><div class="hero-content"><span class="hero-label"><span></span>PLANIFICACIÓN CON PROPÓSITO</span><h2>Del currículo<br>a la cancha.</h2><p>Transforma tus ideas en experiencias de aprendizaje<br class="desktop"> para cada grado de secundaria.</p><button class="btn light" data-action="example">Explorar sesión de ejemplo ${icon("arrow")}</button><small>3.º de secundaria <b>·</b> Gimnasia <b>·</b> 135 minutos</small></div><div class="hero-art">${athlete}<span class="art-caption">EL MOVIMIENTO NOS TRANSFORMA</span></div></section><section class="stats" aria-label="Resumen de la biblioteca"><div class="stat"><span class="stat-icon sage">${icon("book")}</span><div><strong>${sessions.length.toString().padStart(2, "0")}</strong><span>Sesiones en tu biblioteca</span></div></div><div class="stat"><span class="stat-icon peach">${icon("check")}</span><div><strong>${ready.toString().padStart(2, "0")}</strong><span>Listas para llevar a clase</span></div></div><div class="stat"><span class="stat-icon lavender">${icon("clock")}</span><div><strong>${minutes}<small> min</small></strong><span>De aprendizaje planificado</span></div></div></section><section class="recent"><div class="section-heading"><div><h2>Tu biblioteca, en movimiento</h2><p>Retoma tus ideas y sigue construyendo.</p></div><button class="text-btn" data-action="library">Ver todas las sesiones ${icon("arrow")}</button></div><div class="session-grid">${sessions
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 2)
    .map(card)
    .join(
      "",
    )}<button class="new-card" data-action="new"><span>${icon("plus")}</span><h3>Una nueva experiencia</h3><p>¿Qué aprenderán hoy<br>tus estudiantes?</p><b>Crear sesión ${icon("arrow")}</b></button></div></section><section class="curriculum-banner"><span class="banner-icon">${icon("book")}</span><div><h3>Una planificación conectada al CNEB</h3><p>Competencias, capacidades y evaluación con un mismo propósito.</p></div><button class="text-btn" data-action="curriculum">Consultar guía ${icon("arrow")}</button></section><p class="local-note">${icon("check")}Tu biblioteca se guarda en este navegador. Descarga un respaldo para conservarla o trasladarla a otro equipo.</p>`;
}
function dateLabel(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "Sin fecha"
    : new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "short",
        timeZone: "America/Lima",
      }).format(d);
}
function card(s) {
  return `<article class="session-card"><div class="card-visual"><span class="topic-tag">${esc(s.topic || "Educación Física")}</span><button class="icon-btn favorite ${s.favorite ? "selected" : ""}" data-action="favorite" data-id="${esc(s.id)}" aria-label="${s.favorite ? "Quitar de favoritas" : "Marcar como favorita"}" aria-pressed="${s.favorite}">${icon("star")}</button><svg viewBox="0 0 300 120" aria-hidden="true"><path d="M0 105h300M18 20v100M82 0v120M146 0v120M210 0v120M274 0v120" stroke="currentColor" stroke-opacity=".1" fill="none"/><circle cx="180" cy="36" r="10" fill="currentColor"/><path d="m174 58-25 20-42-3m67-17 30 16 31-33m-61 17 7 28-34 26m34-26 39 18" stroke="currentColor" stroke-width="11" stroke-linecap="round" fill="none"/><circle cx="50" cy="62" r="28" stroke="currentColor" stroke-opacity=".18" fill="none"/></svg><span class="grade-tag">${s.grade}.º SECUNDARIA</span></div><div class="card-body"><div class="card-meta"><span class="status ${s.status === "Lista para usar" ? "ready" : ""}"><i></i>${esc(s.status)}</span><span>${icon("clock")}${s.duration} min</span></div><button class="card-title" data-action="edit" data-id="${esc(s.id)}">${esc(s.title)}</button><p>${esc(s.folder || "Sin carpeta")} <span>·</span> ${s.grade < 3 ? "Ciclo VI" : "Ciclo VII"}</p><div class="card-bottom"><span>Editada el ${dateLabel(s.updatedAt)}</span><button class="icon-btn" data-action="edit" data-id="${esc(s.id)}" aria-label="Editar ${esc(s.title)}">${icon("arrow")}</button></div></div></article>`;
}
function filtered() {
  return sessions
    .filter(
      (s) =>
        (!favoriteOnly || s.favorite) &&
        (!gradeFilter || s.grade === Number(gradeFilter)) &&
        (!statusFilter || s.status === statusFilter) &&
        (!folderFilter || s.folder === folderFilter) &&
        `${s.title} ${s.topic} ${s.teacher} ${s.folder}`
          .toLocaleLowerCase("es")
          .includes(query.toLocaleLowerCase("es")),
    )
    .sort((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title, "es")
        : b.updatedAt.localeCompare(a.updatedAt),
    );
}
function library() {
  return `<div class="page-heading compact"><div><p class="eyebrow">TU PLANIFICACIÓN, EN UN SOLO LUGAR</p><h1>${favoriteOnly ? "Sesiones favoritas" : "Mis sesiones"}<span class="orange">.</span></h1><p>Crea, organiza y vuelve a las experiencias que hacen la diferencia.</p></div><button class="btn primary" data-action="new">${icon("plus")}Nueva sesión</button></div><div class="library-tools"><label class="search-box">${icon("search")}<input id="search" type="search" placeholder="Buscar título, tema o carpeta…" value="${esc(query)}" aria-label="Buscar sesiones"></label><select id="grade-filter" aria-label="Filtrar por grado"><option value="">Todos los grados</option>${[1, 2, 3, 4, 5].map((g) => `<option value="${g}" ${Number(gradeFilter) === g ? "selected" : ""}>${g}.º secundaria</option>`).join("")}</select><select id="status-filter" aria-label="Filtrar por estado"><option value="">Todos los estados</option>${["Borrador", "Lista para usar", "Archivada"].map((s) => `<option ${statusFilter === s ? "selected" : ""}>${s}</option>`).join("")}</select><select id="folder-filter" aria-label="Filtrar por carpeta"><option value="">Todas las carpetas</option>${[...new Set(sessions.map((s) => s.folder).filter(Boolean))].map((f) => `<option ${folderFilter === f ? "selected" : ""}>${esc(f)}</option>`).join("")}</select><button class="btn" data-action="import">Importar JSON</button></div><div class="library-count"><span id="results-count">${filtered().length} sesiones</span><select id="sort" aria-label="Ordenar sesiones"><option value="recent" ${sort === "recent" ? "selected" : ""}>Más recientes primero</option><option value="title" ${sort === "title" ? "selected" : ""}>Título: A–Z</option></select></div><div id="library-results" class="session-grid library-grid">${libraryCards()}</div>`;
}
function libraryCards() {
  const list = filtered();
  return list.length
    ? list.map(card).join("")
    : `<div class="empty"><span>${icon("book")}</span><h2>No hay sesiones aquí todavía</h2><p>Prueba otros filtros o empieza una nueva experiencia.</p><button class="btn primary" data-action="new">Crear sesión</button><button class="text-btn" data-action="clear-filters">Limpiar filtros</button></div>`;
}
const field = (label, key, type = "text", extra = "") =>
  `<label class="field ${type === "textarea" ? "wide" : ""}"><span>${label}</span>${type === "textarea" ? `<textarea data-field="${key}" rows="4" ${extra}>${esc(getPath(draft, key))}</textarea>` : `<input data-field="${key}" type="${type}" value="${esc(getPath(draft, key))}" ${extra}>`}</label>`;
const selectField = (label, key, options) =>
  `<label class="field"><span>${label}</span><select data-field="${key}" aria-label="${esc(label)}">${options.map(([v, l]) => `<option value="${esc(v)}" ${String(getPath(draft, key)) === String(v) ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>`;
function getPath(o, p) {
  return p.split(".").reduce((a, k) => a?.[k], o);
}
function setPath(o, p, v) {
  const keys = p.split(".");
  const last = keys.pop();
  keys.reduce((a, k) => a[k], o)[last] = v;
}
const tabs = [
  "Datos generales",
  "Propósitos",
  "Transversales",
  "Secuencia didáctica",
  "Evaluación y ajustes",
];
function exportControls() {
  const summary = durationSummary(draft);
  return `<div class="export-settings"><label class="field"><span>Formato de exportación</span><select id="export-format"><option value="institutional" ${exportOptions.format === "institutional" ? "selected" : ""}>Institucional en cuadros</option><option value="descriptive" ${exportOptions.format === "descriptive" ? "selected" : ""}>Descriptivo detallado</option></select></label><label class="field"><span>Lista de cotejo</span><select id="export-checklist"><option value="individual" ${exportOptions.checklist === "individual" ? "selected" : ""}>Individual</option><option value="group" ${exportOptions.checklist === "group" ? "selected" : ""}>Grupal</option></select></label><label><input type="checkbox" id="export-director" ${exportOptions.director ? "checked" : ""}> Incluir visto bueno de la dirección</label><p role="status" class="${summary.valid ? "" : "invalid"}">${summary.valid ? "Tiempo verificado" : "Revisar duración"}: ${summary.minutes} / ${esc(draft.duration)} minutos.</p><button class="btn primary" data-action="pdf">Imprimir / Guardar PDF</button></div>`;
}
function editor() {
  if (!draft) return "";
  const t = totals(draft),
    sum = Object.values(t).reduce((a, b) => a + b, 0);
  return `<div class="editor-top"><button class="text-btn" data-action="library">${icon("back")}Volver a mis sesiones</button><span id="save-state" class="save-state">${dirty ? "Cambios sin guardar" : "Sesión guardada en este navegador"}</span></div><div class="page-heading editor-heading"><div><p class="eyebrow">CONSTRUYE UNA EXPERIENCIA DE APRENDIZAJE</p><h1>${preview ? "Vista de la sesión" : "Editor de sesión"}<span class="orange">.</span></h1><p>${esc(draft.title)}</p></div><div class="button-row"><button class="btn" data-action="preview">${icon(preview ? "settings" : "eye")}${preview ? "Seguir editando" : "Vista previa"}</button><button class="btn primary" data-action="save">${icon("check")}Guardar sesión</button></div></div><div class="editor-toolbar"><div class="button-row"><span class="grade-badge">${draft.grade}.º secundaria</span><span class="time-total ${sum !== draft.duration ? "invalid" : ""}" id="time-summary">${icon("clock")}${sum} / ${draft.duration} min</span></div><div class="button-row"><button class="text-btn" data-action="duplicate">${icon("copy")}Duplicar</button><button class="text-btn" data-action="export">${icon("download")}Descargar</button><button class="icon-btn danger-text" data-action="delete" aria-label="Eliminar sesión">${icon("trash")}</button></div></div>${preview ? `${exportControls()}<div class="document-wrap">${documentBody(draft, exportOptions)}</div>` : `<div class="editor-layout"><nav class="editor-tabs" aria-label="Secciones de la sesión">${tabs.map((x, i) => `<button class="${i === tab ? "active" : ""}" data-action="tab" data-tab="${i}"><span>${String(i + 1).padStart(2, "0")}</span>${x}${icon("chevron")}</button>`).join("")}<div class="editor-note">${icon("book")}<p>La propuesta es editable. Contextualízala a las necesidades y posibilidades de tu grupo.</p></div></nav><section class="editor-panel"><div class="panel-title"><p class="eyebrow">SECCIÓN ${tab + 1} DE 5</p><h2>${tabs[tab]}</h2><p>${["El punto de partida de tu sesión de aprendizaje.", "Conecta lo que se aprende, se hace y se evalúa.", "Aprendizajes que atraviesan cada experiencia.", "Organiza una progresión segura, con tiempos claros.", "Observa el proceso y adapta la experiencia."][tab]}</p></div>${editorFields()}<div class="editor-pagination">${tab > 0 ? `<button class="btn" data-action="tab" data-tab="${tab - 1}">${icon("back")}Anterior</button>` : "<span></span>"}${tab < 4 ? `<button class="btn primary" data-action="tab" data-tab="${tab + 1}">Continuar ${icon("arrow")}</button>` : '<button class="btn primary" data-action="preview">Revisar sesión ' + icon("eye") + "</button>"}</div></section></div>`}`;
}
function editorFields() {
  if (tab === 0)
    return `<div class="form-grid">${field("Título de la sesión *", "title", "text", 'maxlength="180"')}${field("Tema / disciplina", "topic")}${field("Institución educativa", "institution")}${field("Docente", "teacher")}${selectField(
      "Grado *",
      "grade",
      [1, 2, 3, 4, 5].map((g) => [g, `${g}.º de secundaria`]),
    )}${field("Sección", "section")}${field("Fecha", "date", "date")}${field("Duración total (minutos) *", "duration", "number", 'min="1" max="1440"')}${field("Carpeta", "folder", "text", 'placeholder="Ej. Gimnasia, atletismo, unidad 1…"')}${selectField(
      "Estado",
      "status",
      ["Borrador", "Lista para usar", "Archivada"].map((x) => [x, x]),
    )}</div><div class="info-note">${icon("clock")}Una hora pedagógica equivale a 45 minutos. La sesión de ejemplo suma 135 minutos: 25 de inicio, 95 de desarrollo y 15 de cierre.</div>`;
  if (tab === 1)
    return `<div class="form-grid">${selectField(
      "Competencia principal",
      "competency",
      competencies.map((c, i) => [i, c.name]),
    )}<div class="field wide"><span>Capacidades correspondientes</span><div class="capacity-box">${competencies[draft.competency].capacities.map((c) => `<p>${icon("check")}${esc(c)}</p>`).join("")}</div></div>${field("Desempeño del grado · síntesis orientativa editable", "performance", "textarea")}${field("Desempeño precisado según el tema *", "precise", "textarea")}${field("Propósito de aprendizaje *", "purpose", "textarea")}${field("Evidencias de aprendizaje *", "evidence", "textarea")}${field("Instrumento de evaluación *", "instrument")}</div><div class="info-note">${icon("book")}Consulta el desempeño íntegro en el <a href="${SOURCE}" target="_blank" rel="noopener">Programa Curricular del MINEDU</a>. Las síntesis y precisiones no son citas textuales.</div>`;
  if (tab === 2)
    return `<div class="form-grid">${field("Competencia transversal", "transversal")}${field("Capacidades transversales", "transversalCapacities", "textarea")}${field("Actuación observable de la competencia transversal", "transversalAttitude", "textarea")}${field("Enfoques transversales", "approach", "textarea")}${field("Actitudes observables", "attitude", "textarea")}</div>`;
  if (tab === 3)
    return `<div class="info-note">${icon("clock")}Los tiempos incluyen organización, pausas y transiciones. Ajusta las actividades hasta completar la duración total.</div>${Object.entries(
      phases,
    )
      .map(
        ([p, label]) =>
          `<div class="phase-heading"><h3>${label}</h3><span id="phase-total-${p}">${totals(draft)[p]} minutos</span></div>${draft.sequence[p].map((a, i) => `<details class="activity-editor" ${i === 0 ? "open" : ""}><summary><span class="activity-number">${i + 1}</span><span>${esc(a.name)}</span><b>${a.time} min</b>${icon("chevron")}</summary><div class="activity-fields form-grid">${field("Nombre de la actividad *", `sequence.${p}.${i}.name`)}${field("Tiempo (minutos) *", `sequence.${p}.${i}.time`, "number", 'min="1" max="1440"')}${field("Organización *", `sequence.${p}.${i}.organization`, "textarea")}${field("Materiales *", `sequence.${p}.${i}.materials`)}${field("Descripción de la ejecución *", `sequence.${p}.${i}.execution`, "textarea")}${field("Indicaciones y correcciones técnicas *", `sequence.${p}.${i}.technique`, "textarea")}${field("Medidas de seguridad *", `sequence.${p}.${i}.safety`, "textarea")}<div class="activity-actions"><button class="text-btn" data-action="move-activity" data-phase="${p}" data-index="${i}" data-direction="-1" ${i === 0 ? "disabled" : ""}>↑ Subir</button><button class="text-btn" data-action="move-activity" data-phase="${p}" data-index="${i}" data-direction="1" ${i === draft.sequence[p].length - 1 ? "disabled" : ""}>↓ Bajar</button><button class="text-btn danger-text" data-action="remove-activity" data-phase="${p}" data-index="${i}">${icon("trash")}Eliminar actividad</button></div></div></details>`).join("")}<button class="btn add-activity" data-action="add-activity" data-phase="${p}">${icon("plus")}Añadir actividad en ${label.toLowerCase()}</button>`,
      )
      .join("")}`;
  return `<div class="form-grid">${criterionTypes.map((type, i) => field(`Criterio ${i + 1} · ${type} *`, `criteria.${i}`, "textarea")).join("")}${field("Adaptaciones y atención a la diversidad", "adaptations", "textarea")}${field("Previsiones y observaciones del docente", "notes", "textarea")}</div><div class="info-note">${icon("check")}La descarga incluye una ficha de observación con los cuatro criterios, espacio para evidencias y retroalimentación.</div>`;
}
function curriculum() {
  return `<div class="page-heading compact"><div><p class="eyebrow">UN MARCO PARA ENSEÑAR CON INTENCIÓN</p><h1>Del propósito a la acción<span class="orange">.</span></h1><p>Referencias para una planificación coherente en Educación Física.</p></div></div><div class="curriculum-intro"><div class="reference-label">CNEB · EDUCACIÓN SECUNDARIA</div><h2>El movimiento como oportunidad de aprendizaje.</h2><p>Selecciona una competencia en función de las necesidades de tus estudiantes. Relaciona el desempeño del grado con un propósito, una evidencia y criterios que puedas observar durante las actividades.</p><div class="button-row"><a class="btn primary" href="${SOURCE}" target="_blank" rel="noopener">Programa Curricular ${icon("arrow")}</a><a class="btn" href="https://www.minedu.gob.pe/curriculo/pdf/curriculo-nacional-de-la-educacion-basica.pdf" target="_blank" rel="noopener">Consultar CNEB ${icon("arrow")}</a></div></div><div class="competency-grid">${competencies.map((c, i) => `<article><span class="competency-number">0${i + 1}</span><h2>${c.name}</h2><p class="eyebrow">CAPACIDADES</p>${c.capacities.map((x) => `<p>${icon("check")}${esc(x)}</p>`).join("")}</article>`).join("")}</div><div class="curriculum-bottom"><h2>Una ruta de planificación</h2><div class="planning-route">${["Desempeño del grado", "Propósito contextualizado", "Evidencia observable", "Criterios de evaluación", "Actividades progresivas"].map((x, i) => `<span><b>${i + 1}</b>${x}</span>`).join("")}</div><p>1.º y 2.º corresponden al ciclo VI; 3.º, 4.º y 5.º al ciclo VII. Las síntesis de desempeños incluidas son orientativas. Revisa el texto oficial y contextualiza antes de aplicar una sesión.</p></div>`;
}
function openEditor(s) {
  draft = structuredClone(s);
  view = "editor";
  tab = 0;
  dirty = false;
  preview = false;
  render();
  window.scrollTo(0, 0);
}
function markDirty() {
  dirty = true;
  const el = document.querySelector("#save-state");
  if (el) el.textContent = "Cambios sin guardar";
}
function save() {
  if (
    !draft.title.trim() ||
    !Number.isFinite(draft.duration) ||
    draft.duration < 1 ||
    draft.duration > 1440
  ) {
    toast("Escribe un título y una duración entre 1 y 1440 minutos.");
    return;
  }
  const errors = validate(draft);
  if (errors.length && draft.status === "Lista para usar") {
    dialog(
      "Revisa tu sesión",
      `<p>Completa estos puntos para guardar:</p><ul class="error-list">${errors.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>`,
      '<button class="btn primary" data-action="close-modal">Volver al editor</button>',
    );
    return;
  }
  const next = {
    ...structuredClone(draft),
    updatedAt: new Date().toISOString(),
  };
  const found = sessions.some((s) => s.id === next.id);
  if (
    persist(
      found
        ? sessions.map((s) => (s.id === next.id ? next : s))
        : [next, ...sessions],
    )
  ) {
    draft = structuredClone(next);
    dirty = false;
    render();
    toast(
      errors.length
        ? "Borrador guardado. Completa los campos pendientes antes de marcar la sesión como lista."
        : "Sesión guardada en este navegador.",
    );
  }
}
function download(content, name, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 70) || "sesion";
function newDialog() {
  dialog(
    "Una nueva experiencia",
    `<p>Genera una propuesta o conserva las opciones de plantilla y sesión en blanco.</p><button class="btn primary" data-action="ai-dialog">Generar sesión con IA</button><label class="field"><span>Grado</span><select id="new-grade">${[1, 2, 3, 4, 5].map((g) => `<option value="${g}" ${g === 3 ? "selected" : ""}>${g}.º de secundaria</option>`).join("")}</select></label><label class="field"><span>Punto de partida</span><select id="new-template"><option value="gym">Fundamentos técnicos de la gimnasia</option><option value="blank">Sesión en blanco · cualquier tema</option></select></label>`,
    '<button class="btn" data-action="close-modal">Cancelar</button><button class="btn primary" data-action="create">Crear sesión ' +
      icon("arrow") +
      "</button>",
  );
}
function generationDialog() {
  modal.close();
  dialog(
    "Generar sesión con IA",
    `<p>Modo de prueba sin costo: respuesta simulada y revisada de 4.º, atletismo y 135 minutos. No se consulta una API.</p>
    <label class="field"><span>Modo de generación</span><select id="ai-mode" aria-label="Modo de generación"><option value="mock">Simulación local · sin costo</option><option value="real" ${generationConfig.realEnabled && generationConfig.endpoint ? "" : "disabled"}>IA real · pendiente de configuración y autorización</option></select></label>
    <label class="field"><span>Grado</span><select id="ai-grade" aria-label="Grado de secundaria">${[1, 2, 3, 4, 5].map((g) => `<option value="${g}" ${g === 4 ? "selected" : ""}>${g}.º de secundaria</option>`).join("")}</select></label>
    <label class="field"><span>Tema de aprendizaje</span><input id="ai-topic" aria-label="Tema de aprendizaje" maxlength="180" value="Fundamentos técnicos del atletismo"></label>
    <label class="field"><span>Duración en minutos (30–240)</span><input id="ai-duration" aria-label="Duración en minutos" type="number" min="30" max="240" step="1" value="135"></label>
    <label class="field"><span>Características del grupo (opcional, sin nombres ni datos personales)</span><textarea id="ai-group" aria-label="Características del grupo" rows="3" maxlength="800" placeholder="Ej. 28 estudiantes, ritmos diversos y patio de 30 metros."></textarea></label>
    <div id="ai-access-field" hidden><label class="field"><span>Código de acceso privado del generador · no es la clave API</span><input id="ai-access" aria-label="Código de acceso privado" type="password" autocomplete="off" maxlength="256"></label></div>
    <p id="ai-notice" role="status">La sesión simulada se abrirá como borrador editable. Revisa y contextualiza antes de usarla.</p><p id="ai-error" role="alert"></p>`,
    '<button class="btn" data-action="close-modal">Cancelar</button><button class="btn primary" data-action="ai-generate">Generar sesión</button>',
  );
}
async function runGeneration(button) {
  if (generationController) return;
  const mode = document.querySelector("#ai-mode").value;
  const input = {
    grade: Number(document.querySelector("#ai-grade").value),
    topic: document.querySelector("#ai-topic").value,
    duration: Number(document.querySelector("#ai-duration").value),
    group: document.querySelector("#ai-group").value,
  };
  const errorBox = document.querySelector("#ai-error");
  errorBox.textContent = "";
  generationController = new AbortController();
  const controller = generationController;
  const timeout = setTimeout(() => controller.abort(), 65000);
  button.disabled = true;
  button.textContent =
    mode === "mock" ? "Preparando simulación…" : "Generando sesión…";
  modal.setAttribute("aria-busy", "true");
  try {
    const session = await generateSession(input, {
      mode,
      accessCode: document.querySelector("#ai-access").value,
      signal: controller.signal,
    });
    if (controller.signal.aborted) return;
    modal.close();
    openEditor(session);
    markDirty();
    toast(
      mode === "mock"
        ? "Sesión simulada abierta. No se consumió ninguna API."
        : "Propuesta de IA abierta. Revisa el contenido antes de guardar.",
    );
  } catch (error) {
    if (modal.open)
      errorBox.textContent =
        error.name === "AbortError"
          ? "La generación se canceló o agotó su tiempo. No se reintentó automáticamente."
          : error.message;
  } finally {
    clearTimeout(timeout);
    generationController = null;
    modal.removeAttribute("aria-busy");
    button.disabled = false;
    button.textContent = "Generar sesión";
  }
}
modal.addEventListener("close", () => {
  generationController?.abort();
  const access = document.querySelector("#ai-access");
  if (access) access.value = "";
});
modal.addEventListener("change", (e) => {
  if (e.target.id === "ai-mode") {
    const real = e.target.value === "real";
    document.querySelector("#ai-access-field").hidden = !real;
    document.querySelector("#ai-notice").textContent = real
      ? "La IA real envía grado, tema, duración y características del grupo al backend y a OpenAI. Consume la cuota autorizada. No incluyas datos personales."
      : "Simulación local: únicamente 4.º, atletismo, 135 minutos. Sin conexión a una API.";
  }
});
app.addEventListener("input", (e) => {
  const el = e.target;
  if (el.matches("[data-field]")) {
    const p = el.dataset.field;
    setPath(
      draft,
      p,
      ["grade", "duration", "competency"].includes(p) || p.endsWith(".time")
        ? Number(el.value)
        : el.value,
    );
    markDirty();
    if (p === "duration" || p.endsWith(".time")) {
      const t = totals(draft);
      const sum = Object.values(t).reduce((a, b) => a + b, 0);
      document.querySelector("#time-summary").innerHTML =
        `${icon("clock")}${sum} / ${draft.duration} min`;
      document
        .querySelector("#time-summary")
        .classList.toggle("invalid", sum !== draft.duration);
      for (const phase in t) {
        const x = document.querySelector(`#phase-total-${phase}`);
        if (x) x.textContent = `${t[phase]} minutos`;
      }
    }
  }
  if (el.id === "search") {
    query = el.value;
    document.querySelector("#library-results").innerHTML = libraryCards();
    document.querySelector("#results-count").textContent =
      `${filtered().length} sesiones`;
  }
});
app.addEventListener("change", (e) => {
  const el = e.target;
  if (["export-format", "export-checklist", "export-director"].includes(el.id)) {
    if (el.id === "export-format") exportOptions.format = el.value;
    if (el.id === "export-checklist") exportOptions.checklist = el.value;
    if (el.id === "export-director") exportOptions.director = el.checked;
    render();
    document.getElementById(el.id)?.focus();
    return;
  }
  if (["grade", "competency"].includes(el.dataset.field)) {
    const key = el.dataset.field;
    draft[key] = Number(el.value);
    draft.performance =
      competencies[draft.competency].performances[draft.grade];
    markDirty();
    render();
    toast(
      key === "grade"
        ? "Grado actualizado. Revisa la precisión, los criterios y la dificultad de las actividades."
        : "Competencia actualizada. Revisa la coherencia de propósito, criterios y actividades.",
    );
  }
  const filters = {
    "grade-filter": (v) => (gradeFilter = v),
    "status-filter": (v) => (statusFilter = v),
    "folder-filter": (v) => (folderFilter = v),
    sort: (v) => (sort = v),
  };
  if (filters[el.id]) {
    filters[el.id](el.value);
    render();
  }
});
async function action(e) {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  e.preventDefault();
  const a = btn.dataset.action,
    id = btn.dataset.id;
  const go = (v, fav = false) =>
    discard(() => {
      view = v;
      favoriteOnly = fav;
      draft = null;
      render();
      window.scrollTo(0, 0);
    });
  if (a === "close-modal") {
    modal.close();
    return;
  }
  if (a === "home" || a === "library" || a === "curriculum") {
    go(a);
    return;
  }
  if (a === "favorites") {
    go("library", true);
    return;
  }
  if (a === "help") {
    dialog(
      "Tu espacio de planificación",
      `<p>Impulso funciona sin cuenta. Tus sesiones se guardan solo en este navegador y dispositivo mediante almacenamiento local.</p><p>Usa <strong>Respaldar biblioteca</strong> para conservar un archivo JSON. Puedes importarlo después o en otro equipo. Borrar los datos del navegador elimina la biblioteca local.</p><p><strong>Descargas:</strong> Word genera un archivo .doc compatible; PDF abre el diálogo de impresión para elegir «Guardar como PDF». Los archivos incluyen toda la sesión y la ficha de evaluación.</p><p>Las plantillas son propuestas pedagógicas editables basadas en el CNEB. La simulación del generador funciona localmente. La IA real está desactivada por defecto; si se autoriza, enviará únicamente los datos del formulario de generación al servicio configurado.</p>`,
      '<button class="btn primary" data-action="close-modal">Entendido</button>',
    );
    return;
  }
  if (a === "new") {
    discard(newDialog);
    return;
  }
  if (a === "ai-dialog") {
    generationDialog();
    return;
  }
  if (a === "ai-generate") {
    await runGeneration(btn);
    return;
  }
  if (a === "create") {
    const g = Number(document.querySelector("#new-grade").value),
      blank = document.querySelector("#new-template").value === "blank";
    const s = createSession(g);
    if (blank) {
      Object.assign(s, {
        title: "Nueva sesión de aprendizaje",
        topic: "",
        folder: "",
        precise: "",
        purpose: "",
        evidence: "",
        criteria: ["", "", "", ""],
        sequence: { inicio: [], desarrollo: [], cierre: [] },
      });
    }
    modal.close();
    openEditor(s);
    markDirty();
    return;
  }
  if (a === "example") {
    discard(() => {
      const s = sessions.find(
        (x) =>
          x.title === "Fundamentos técnicos de la gimnasia" && x.grade === 3,
      );
      openEditor(s || createSession());
      if (!s) markDirty();
    });
    return;
  }
  if (a === "edit") {
    discard(() => openEditor(sessions.find((s) => s.id === id)));
    return;
  }
  if (a === "favorite") {
    persist(
      sessions.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s)),
    );
    render();
    return;
  }
  if (a === "clear-filters") {
    query = gradeFilter = statusFilter = folderFilter = "";
    render();
    return;
  }
  if (a === "tab") {
    tab = Number(btn.dataset.tab);
    render();
    window.scrollTo(0, 0);
    return;
  }
  if (a === "preview") {
    preview = !preview;
    render();
    window.scrollTo(0, 0);
    return;
  }
  if (a === "save") {
    save();
    return;
  }
  if (a === "duplicate") {
    const copy = {
      ...structuredClone(draft),
      id: crypto.randomUUID(),
      title: `${draft.title} (copia)`,
      status: "Borrador",
      updatedAt: new Date().toISOString(),
    };
    openEditor(copy);
    markDirty();
    toast("Copia creada en el editor. Guárdala para añadirla a tu biblioteca.");
    return;
  }
  if (a === "delete") {
    dialog(
      "¿Eliminar esta sesión?",
      `<p>Se eliminará <strong>${esc(draft.title)}</strong> de este navegador. Esta acción no se puede deshacer.</p>`,
      '<button class="btn" data-action="close-modal">Conservar</button><button class="btn danger" data-action="confirm-delete">Eliminar sesión</button>',
    );
    return;
  }
  if (a === "confirm-delete") {
    if (persist(sessions.filter((s) => s.id !== draft.id))) {
      modal.close();
      dirty = false;
      draft = null;
      view = "library";
      render();
      toast("Sesión eliminada.");
    }
    return;
  }
  if (a === "add-activity") {
    draft.sequence[btn.dataset.phase].push({
      name: "Nueva actividad",
      time: 5,
      organization: "",
      materials: "",
      execution: "",
      technique: "",
      safety: "",
    });
    markDirty();
    render();
    return;
  }
  if (a === "remove-activity") {
    const p = btn.dataset.phase,
      i = Number(btn.dataset.index);
    dialog(
      "¿Eliminar actividad?",
      `<p>${esc(draft.sequence[p][i].name)}. Tendrás que ajustar el tiempo de la sesión.</p>`,
      '<button class="btn" data-action="close-modal">Cancelar</button><button class="btn danger" id="remove-confirm">Eliminar actividad</button>',
    );
    document.querySelector("#remove-confirm").onclick = () => {
      draft.sequence[p].splice(i, 1);
      markDirty();
      modal.close();
      render();
    };
    return;
  }
  if (a === "move-activity") {
    const list = draft.sequence[btn.dataset.phase],
      i = Number(btn.dataset.index),
      j = i + Number(btn.dataset.direction);
    if (j >= 0 && j < list.length) {
      [list[i], list[j]] = [list[j], list[i]];
      markDirty();
      render();
    }
    return;
  }
  if (a === "backup") {
    download(
      JSON.stringify({ app: "impulso", version: 1, sessions }, null, 2),
      "impulso-respaldo.json",
      "application/json",
    );
    toast("Respaldo de la biblioteca descargado.");
    return;
  }
  if (a === "import") {
    document.querySelector("#import-file").click();
    return;
  }
  if (a === "export") {
    if (!preview) { preview = true; render(); return; }
    dialog(
      "Lleva tu sesión a clase",
      `<p>Se descargará la versión que estás viendo, incluidos los cambios del editor.</p><div class="export-options"><button data-action="word">${icon("file")}<strong>Documento Word</strong><span>.doc compatible y editable</span></button><button data-action="pdf">${icon("download")}<strong>Imprimir / PDF</strong><span>Elige «Guardar como PDF»</span></button><button data-action="json">${icon("folder")}<strong>Respaldo de sesión</strong><span>.json para volver a importar</span></button></div>`,
      '<button class="btn" data-action="close-modal">Cerrar</button>',
    );
    return;
  }
  if (a === "word") {
    download(
      "\ufeff" + exportHtml(draft, exportOptions),
      slug(draft.title) + ".doc",
      "application/msword;charset=utf-8",
    );
    toast("Documento Word descargado.");
    return;
  }
  if (a === "json") {
    download(
      JSON.stringify(
        { app: "impulso", version: 1, sessions: [draft] },
        null,
        2,
      ),
      slug(draft.title) + ".json",
      "application/json",
    );
    toast("Respaldo de sesión descargado.");
    return;
  }
  if (a === "pdf") {
    if (!durationSummary(draft).valid) {
      toast("Revisa los tiempos: la suma de las actividades debe coincidir con la duración de la sesión antes de imprimir.");
      return;
    }
    const w = window.open("", "_blank");
    if (!w) {
      toast("Permite ventanas emergentes para imprimir la sesión.");
      return;
    }
    w.document.open();
    w.document.write(exportHtml(draft, exportOptions));
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
    return;
  }
}
app.addEventListener("click", action);
modal.addEventListener("click", action);
document.querySelector("#import-file").addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    if (f.size > 5_000_000) throw new Error("El archivo supera 5 MB.");
    const data = JSON.parse(await f.text());
    if (data.app !== "impulso" || data.version !== 1)
      throw new Error("Selecciona un respaldo JSON de Impulso (versión 1).");
    const next = mergeImport(sessions, data.sessions);
    if (loadError) {
      toast(
        "No se importó: el almacenamiento local no está disponible. Conserva tu respaldo.",
      );
      return;
    }
    if (persist(next)) {
      view = "library";
      favoriteOnly = false;
      query = gradeFilter = statusFilter = folderFilter = "";
      render();
      toast(
        `${data.sessions.length} sesiones importadas sin reemplazar las existentes.`,
      );
    }
  } catch (err) {
    toast(err.message || "No se pudo leer el respaldo.");
  } finally {
    e.target.value = "";
  }
});
window.addEventListener("beforeunload", (e) => {
  if (dirty) {
    e.preventDefault();
    e.returnValue = "";
  }
});
render();
