import { competencies, validImport, validate } from "../data.js";

export const textFields = [
  "title",
  "topic",
  "precise",
  "purpose",
  "evidence",
  "instrument",
  "transversal",
  "transversalCapacities",
  "transversalAttitude",
  "approach",
  "attitude",
  "adaptations",
  "notes",
];
export const activityFields = [
  "name",
  "organization",
  "materials",
  "execution",
  "technique",
  "safety",
];
const phases = ["inicio", "desarrollo", "cierre"];
const text = { type: "string", minLength: 1, maxLength: 3000 };
const object = (properties) => ({
  type: "object",
  additionalProperties: false,
  properties,
  required: Object.keys(properties),
});
export const sessionSchema = object({
  ...Object.fromEntries(textFields.map((k) => [k, text])),
  competency: { type: "integer", enum: [0, 1, 2] },
  criteria: { type: "array", minItems: 4, maxItems: 4, items: text },
  sequence: object(
    Object.fromEntries(
      phases.map((p) => [
        p,
        {
          type: "array",
          minItems: 1,
          maxItems: 6,
          items: object({
            ...Object.fromEntries(activityFields.map((k) => [k, text])),
            time: { type: "integer", minimum: 1, maximum: 240 },
          }),
        },
      ]),
    ),
  ),
});
export function parseInput(value) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).some(
      (k) => !["grade", "topic", "duration", "group"].includes(k),
    )
  )
    throw new Error("Los datos de generación no son válidos.");
  const { grade, duration, topic, group = "" } = value;
  if (!Number.isInteger(grade) || grade < 1 || grade > 5)
    throw new Error("Selecciona un grado entre 1.º y 5.º de secundaria.");
  if (!Number.isInteger(duration) || duration < 30 || duration > 240)
    throw new Error(
      "La generación admite duraciones enteras de 30 a 240 minutos.",
    );
  if (
    typeof topic !== "string" ||
    topic.trim().length < 6 ||
    topic.length > 180
  )
    throw new Error("Escribe un tema de entre 6 y 180 caracteres.");
  if (typeof group !== "string" || group.length > 800)
    throw new Error(
      "Describe el grupo en un máximo de 800 caracteres, sin datos personales.",
    );
  return { grade, duration, topic: topic.trim(), group: group.trim() };
}
// Validate the same strict contract in both browser and Worker, independently of the provider.
function matches(value, schema) {
  if (schema.type === "object")
    return (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === schema.required.length &&
      schema.required.every(
        (k) =>
          Object.hasOwn(value, k) && matches(value[k], schema.properties[k]),
      )
    );
  if (schema.type === "array")
    return (
      Array.isArray(value) &&
      value.length >= schema.minItems &&
      value.length <= schema.maxItems &&
      value.every((x) => matches(x, schema.items))
    );
  if (schema.type === "integer")
    return (
      Number.isInteger(value) &&
      (schema.enum
        ? schema.enum.includes(value)
        : value >= schema.minimum && value <= schema.maximum)
    );
  return (
    typeof value === "string" &&
    value.trim().length >= schema.minLength &&
    value.length <= schema.maxLength
  );
}
export function toEditorSession(payload, input, mode) {
  const request = parseInput(input);
  if (!matches(payload, sessionSchema))
    throw new Error(
      "La respuesta no tiene la estructura completa de una sesión. Vuelve a intentarlo.",
    );
  const content = structuredClone(payload);
  const session = {
    ...content,
    id: crypto.randomUUID(),
    grade: request.grade,
    duration: request.duration,
    topic: request.topic,
    institution: "",
    teacher: "",
    section: "",
    date: "",
    performance: competencies[content.competency].performances[request.grade],
    folder: request.topic,
    status: "Borrador",
    favorite: false,
    updatedAt: new Date().toISOString(),
    notes: `${mode === "mock" ? "SIMULACIÓN LOCAL: ejemplo de prueba sin llamada a IA." : "PROPUESTA GENERADA CON IA: requiere revisión docente."}\n${content.notes}`,
  };
  if (!validImport(session) || validate(session).length)
    throw new Error(
      "La respuesta está incompleta o sus tiempos no suman la duración solicitada. No se incorporó al editor.",
    );
  return session;
}
