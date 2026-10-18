export const SOURCE =
  "https://www.minedu.gob.pe/curriculo/pdf/programa-curricular-educacion-secundaria.pdf";
export const competencies = [
  {
    name: "Se desenvuelve de manera autónoma a través de su motricidad",
    capacities: ["Comprende su cuerpo.", "Se expresa corporalmente."],
    performances: {
      1: "Mejora la coordinación y fluidez de sus movimientos al practicar habilidades motrices específicas en juegos y actividades físicas.",
      2: "Regula el tono muscular, la postura y el equilibrio al realizar habilidades motrices específicas.",
      3: "Combina eficazmente habilidades motrices específicas y regula su cuerpo en situaciones predeportivas y deportivas, considerando objetos y compañeros.",
      4: "Coordina su cuerpo con precisión para lograr objetivos y analiza la ejecución de sus habilidades para mejorarlas.",
      5: "Responde eficazmente en actividades físicas, revisando la preparación y ejecución de sus movimientos para mejorar el control corporal con seguridad.",
    },
  },
  {
    name: "Asume una vida saludable",
    capacities: [
      "Comprende las relaciones entre la actividad física, alimentación, postura e higiene personal y del ambiente, y la salud.",
      "Incorpora prácticas que mejoran su calidad de vida.",
    ],
    performances: {
      1: "Reconoce los beneficios de la actividad física y practica hábitos de higiene y alimentación saludable.",
      2: "Explica la importancia de la actividad física y regula el esfuerzo según sus posibilidades.",
      3: "Evalúa sus necesidades de actividad física y aplica prácticas de activación y recuperación para cuidar su salud.",
      4: "Relaciona la actividad física con el bienestar y planifica prácticas para mejorar su condición física.",
      5: "Organiza un plan de actividad física para mantener o mejorar su bienestar y evalúa sus resultados.",
    },
  },
  {
    name: "Interactúa a través de sus habilidades sociomotrices",
    capacities: [
      "Se relaciona utilizando sus habilidades sociomotrices.",
      "Crea y aplica estrategias y tácticas de juego.",
    ],
    performances: {
      1: "Participa en juegos cooperativos respetando acuerdos y promoviendo la integración de sus compañeros.",
      2: "Construye acuerdos y propone soluciones durante actividades de cooperación y oposición.",
      3: "Participa de manera inclusiva y propone estrategias colectivas al resolver situaciones de juego.",
      4: "Colabora en la organización de actividades y ajusta estrategias considerando las posibilidades del grupo.",
      5: "Organiza actividades que integran a sus compañeros y evalúa estrategias colectivas en el juego.",
    },
  },
];
export const criterionTypes = [
  "Conceptual",
  "Procedimental 1",
  "Procedimental 2",
  "Actitudinal",
];
const activity = (
  name,
  time,
  organization,
  materials,
  execution,
  technique,
  safety,
) => ({ name, time, organization, materials, execution, technique, safety });
export function gymnastics(grade = 3) {
  const progression = {
    1: "dos elementos y un equilibrio de 3 segundos",
    2: "tres elementos y un equilibrio de 4 segundos",
    3: "cuatro elementos y un equilibrio de 5 segundos",
    4: "cinco elementos, dos cambios de dirección y un equilibrio de 6 segundos",
    5: "seis elementos, transiciones fluidas y un equilibrio de 8 segundos",
  }[grade];
  return {
    precise: `Combina posiciones básicas, apoyos, equilibrios y desplazamientos en una secuencia de ${progression}, regulando la postura y la coordinación según sus posibilidades.`,
    purpose: `Aprender a controlar el cuerpo al enlazar posiciones, apoyos, equilibrios y desplazamientos en un circuito gimnástico seguro, respetando las posibilidades de cada integrante.`,
    evidence: `Ejecución individual de una secuencia de ${progression} dentro del circuito; explicación breve de las bases de apoyo y de dos acuerdos de seguridad.`,
    criteria: [
      "Explica cómo la amplitud de la base de apoyo y la ubicación del cuerpo favorecen el equilibrio e identifica dos medidas de seguridad.",
      `Ejecuta posiciones extendida, agrupada y de escuadra, y mantiene un equilibrio de ${grade < 3 ? grade + 2 : grade === 3 ? 5 : grade === 4 ? 6 : 8} segundos con postura controlada y apoyos seguros.`,
      `Enlaza ${progression} con coordinación, controlando el inicio, las transiciones y la posición final.`,
      "Respeta los turnos y las distancias, cuida los materiales y ofrece una retroalimentación respetuosa a un compañero.",
    ],
    sequence: {
      inicio: [
        activity(
          "Museo de estatuas en movimiento",
          7,
          "Parejas distribuidas en un espacio delimitado; 2 metros entre parejas.",
          "Conos y tarjetas de posiciones.",
          "Caminar libremente a una señal. Al escuchar «museo», adoptar una postura con dos o tres apoyos. La pareja observa y describe qué ayuda a mantenerla. Intercambiar roles y variar las formas sin competir.",
          "Mirada al frente, abdomen activo y respiración continua. Corregir la alineación sin forzar articulaciones.",
          "Suelo plano y seco. Sin elevaciones, empujones ni contacto físico para corregir.",
        ),
        activity(
          "Activamos nuestro cuerpo",
          8,
          "Grupo en semicírculo y luego en filas con espacio propio.",
          "Conos y colchonetas.",
          "Caminar y trotar suavemente 3 minutos; realizar movilidad de tobillos, rodillas, cadera, hombros y muñecas 3 minutos; cerrar con 2 minutos de pasos laterales y alcances alternados.",
          "Aumentar el ritmo gradualmente; flexionar suavemente rodillas y apoyar toda la planta.",
          "Evitar rebotes, dolor y estiramientos forzados. Permitir marcha suave y pausas de hidratación.",
        ),
        activity(
          "Saberes previos, reto y propósito",
          10,
          "Círculo, con demostración breve del docente.",
          "Tarjetas o pizarra.",
          "Preguntar: ¿Qué posiciones gimnásticas conocen? ¿Qué cambia cuando usamos uno, dos o más apoyos? Reto: ¿cómo enlazar movimientos y sostener el equilibrio sin perder seguridad? Presentar el propósito, el circuito final y los cuatro criterios. Recoger dos propuestas de acuerdos.",
          "Relacionar las respuestas con base de apoyo, alineación y control corporal. Solicitar una demostración voluntaria de baja dificultad.",
          "Nadie debe demostrar movimientos que no domina. Acordar señal de pausa y alternativas de participación.",
        ),
      ],
      desarrollo: [
        activity(
          "El alfabeto corporal",
          15,
          "Tríos: ejecutante, observador y lector de tarjeta; rotación cada 2 minutos.",
          "Una colchoneta por trío y tarjetas.",
          "Explorar posición extendida de pie y en el suelo, agrupada sentado y escuadra sentado con manos de apoyo. Mantener cada forma 3–5 segundos. El observador identifica apoyos y ofrece una sugerencia. Enlazar dos posiciones lentamente.",
          "Buscar alineación de cabeza y tronco. En escuadra, flexionar rodillas si es necesario; no exigir amplitud máxima.",
          "Colchonetas sin separaciones y sin deslizamiento; no cargar peso sobre cabeza o cuello.",
        ),
        activity(
          "Apoyos que construyen estabilidad",
          20,
          "Tríos en zonas marcadas, uno ejecuta por turno.",
          "Colchonetas y marcas en el suelo.",
          "Desde cuadrupedia, separar manos al ancho de hombros y rodillas al de caderas. Balancear el peso suavemente. Extender un brazo o una pierna; volver al apoyo inicial. Alternar lados y combinar apoyos en cuatro recorridos cortos con descansos.",
          "Manos abiertas, codos sin bloqueo y espalda neutra. Reducir la palanca si se pierde control.",
          "No realizar inversiones ni puentes. Ante molestias de muñeca, usar apoyos de antebrazos sobre superficie estable o realizar la variante sentada.",
        ),
        activity(
          "Laboratorio de equilibrios",
          20,
          "Parejas junto a líneas en el suelo; sin superficies elevadas.",
          "Cinta de papel, conos y colchonetas.",
          "Recorrer una línea con pasos cortos; detenerse en apoyo bipodal y luego unipodal. Probar brazos abiertos y mirada fija. Mantener el tiempo del criterio, alternar pierna y registrar qué ajuste ayudó. Ofrecer apoyo de pared cuando se necesite.",
          "Mirar un punto estable, activar el tronco y flexionar levemente la pierna de apoyo. Volver a dos apoyos antes de perder estabilidad.",
          "Sin ojos cerrados, alturas ni competencia por duración. Espacio despejado y ayuda consentida; variante sentada con cambios de posición de brazos.",
        ),
        activity(
          "Conectamos movimientos",
          15,
          "Grupos de cuatro en carriles separados.",
          "Conos, líneas y tarjetas de secuencias.",
          "Combinar marcha lateral, giro de un cuarto de vuelta, posición agrupada y equilibrio. Ensayar lentamente, cambiar un elemento según posibilidades y practicar con una cuenta de ocho tiempos. Un compañero da una sugerencia basada en un criterio.",
          "Evitar movimientos bruscos al cambiar de nivel. Flexionar rodillas y coordinar brazos y pasos. Priorizar control sobre velocidad.",
          "Desplazamientos en un solo sentido y sin saltos complejos. Salir caminando de la zona de ejecución.",
        ),
        activity(
          "Circuito: mi secuencia gimnástica",
          25,
          "Cuatro estaciones; grupos de cuatro a seis. Docente supervisa la estación de apoyos.",
          "Colchonetas, conos, cinta y lista de cotejo.",
          "Dedicar 3 minutos a explicar y demostrar. Realizar cuatro estaciones de 4 minutos: posiciones básicas, apoyos en cuadrupedia, equilibrio sobre línea y combinación de desplazamientos; usar 1 minuto entre estaciones para transición e hidratación (3 minutos). En los 3 minutos finales, mostrar una secuencia que integre los elementos del criterio. Observar a cada estudiante y registrar evidencias.",
          "Enlazar sin prisa; inicio y final estables, mirada orientada y respiración continua. Retroalimentar una mejora concreta y permitir reintento.",
          "Comprobar colchonetas antes de iniciar. Un ejecutante por zona. Sin volteretas, inversiones, pirámides ni aparatos elevados. Adaptar el circuito al espacio, la condición y las necesidades individuales.",
        ),
      ],
      cierre: [
        activity(
          "Volvemos a la calma",
          7,
          "Círculo con espacio personal.",
          "Colchonetas y agua.",
          "Caminar suavemente 2 minutos; realizar respiración lenta 2 minutos y movilidad suave de hombros, espalda y piernas durante 3 minutos. Reconocer sensaciones y recuperar la hidratación.",
          "Respirar sin retener el aire. Mantener amplitud cómoda sin rebotes ni presión externa.",
          "Interrumpir cualquier postura dolorosa. Evitar pasar bruscamente de esfuerzo a inmovilidad.",
        ),
        activity(
          "Reflexionamos y proyectamos",
          8,
          "Círculo de diálogo y autoevaluación individual.",
          "Lista de cotejo y tarjeta de salida.",
          "Preguntar: ¿qué apoyos te dieron más estabilidad?, ¿cómo mejoraste una transición?, ¿qué medida protegió a tu grupo? Cada estudiante indica un logro y un aspecto por mejorar según los criterios. Explicar por qué una base amplia favorece el equilibrio y acordar una meta para la próxima sesión.",
          "Retroalimentar con evidencias observadas, sin comparar cuerpos ni rendimientos. Relacionar el aprendizaje con posturas de la vida cotidiana.",
          "Nadie está obligado a exhibir su ejecución ante el grupo. No dejar tareas gimnásticas de riesgo para practicar sin supervisión.",
        ),
      ],
    },
  };
}
export function createSession(grade = 3) {
  const content = gymnastics(grade);
  return {
    id: crypto.randomUUID(),
    title: "Fundamentos técnicos de la gimnasia",
    topic: "Gimnasia",
    grade,
    section: "",
    institution: "",
    teacher: "",
    date: "",
    duration: 135,
    competency: 0,
    performance: competencies[0].performances[grade],
    ...content,
    instrument: "Lista de cotejo",
    transversal: "Gestiona su aprendizaje de manera autónoma",
    transversalCapacities:
      "Define metas de aprendizaje. Organiza acciones estratégicas para alcanzar sus metas. Monitorea y ajusta su desempeño durante el proceso de aprendizaje.",
    transversalAttitude:
      "Propone una meta motriz alcanzable, elige una variante segura y ajusta su secuencia a partir de la retroalimentación.",
    approach:
      "Inclusivo o de atención a la diversidad; orientación al bien común",
    attitude:
      "Reconoce las distintas posibilidades motrices, acepta las variantes de participación y comparte los materiales sin excluir a nadie.",
    adaptations:
      "Ofrecer equilibrios con apoyo de pared, posiciones sentadas y recorridos más cortos. Acordar ajustes con el estudiante; permitir pausas y roles de observación sin reemplazar innecesariamente su participación motriz.",
    notes:
      "Verificar el estado del espacio y las colchonetas. Conocer las necesidades individuales y acordar variantes antes de iniciar.",
    folder: "Gimnasia",
    status: "Borrador",
    favorite: false,
    updatedAt: new Date().toISOString(),
  };
}
export const phases = {
  inicio: "Inicio",
  desarrollo: "Desarrollo",
  cierre: "Cierre",
};
export function totals(s) {
  return Object.fromEntries(
    Object.keys(phases).map((p) => [
      p,
      s.sequence[p].reduce((a, b) => a + Number(b.time || 0), 0),
    ]),
  );
}
export function validate(s) {
  const errors = [];
  if (!s.title?.trim()) errors.push("Escribe el título de la sesión.");
  if (!Number.isInteger(s.grade) || s.grade < 1 || s.grade > 5)
    errors.push("Elige un grado entre 1.º y 5.º.");
  if (!Number.isInteger(s.competency) || !competencies[s.competency])
    errors.push("Elige una competencia válida.");
  if (!Number.isFinite(s.duration) || s.duration < 1)
    errors.push("La duración debe ser mayor que cero.");
  if (s.criteria.length !== 4 || s.criteria.some((c) => !c.trim()))
    errors.push("Completa los cuatro criterios de evaluación.");
  for (const key of [
    "performance",
    "precise",
    "purpose",
    "evidence",
    "instrument",
  ])
    if (!s[key]?.trim())
      errors.push(
        "Completa los propósitos, desempeño, evidencia e instrumento.",
      );
  const t = totals(s);
  if (Object.values(t).reduce((a, b) => a + b, 0) !== Number(s.duration))
    errors.push(
      "Los tiempos de las actividades deben sumar la duración total.",
    );
  for (const p of Object.keys(phases)) {
    if (!s.sequence[p].length)
      errors.push(`Agrega al menos una actividad en ${phases[p]}.`);
    for (const a of s.sequence[p])
      if (
        [
          "name",
          "organization",
          "materials",
          "execution",
          "technique",
          "safety",
        ].some((k) => !a[k]?.trim()) ||
        !Number.isFinite(a.time) ||
        a.time <= 0
      )
        errors.push(
          `Completa todos los campos y el tiempo de las actividades de ${phases[p]}.`,
        );
  }
  return [...new Set(errors)];
}
export function validImport(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const sample = createSession();
  for (const [key, v] of Object.entries(sample))
    if (
      key !== "sequence" &&
      key !== "criteria" &&
      (typeof value[key] !== typeof v || String(value[key]).length > 50000)
    )
      return false;
  if (
    !Array.isArray(value.criteria) ||
    value.criteria.length !== 4 ||
    value.criteria.some((x) => typeof x !== "string" || x.length > 10000)
  )
    return false;
  if (
    !value.sequence ||
    Object.keys(phases).some(
      (p) =>
        !Array.isArray(value.sequence[p]) ||
        value.sequence[p].length > 50 ||
        value.sequence[p].some(
          (a) =>
            !a ||
            typeof a.time !== "number" ||
            !Number.isFinite(a.time) ||
            [
              "name",
              "organization",
              "materials",
              "execution",
              "technique",
              "safety",
            ].some((k) => typeof a[k] !== "string" || a[k].length > 20000),
        ),
    )
  )
    return false;
  return (
    value.grade >= 1 &&
    value.grade <= 5 &&
    Number.isInteger(value.grade) &&
    Number.isInteger(value.competency) &&
    !!competencies[value.competency] &&
    Number.isFinite(value.duration) &&
    !Number.isNaN(Date.parse(value.updatedAt)) &&
    ["Borrador", "Lista para usar", "Archivada"].includes(value.status)
  );
}
