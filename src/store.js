import { validImport, createSession } from "./data.js";
export const KEY = "impulso.sessions.v1";
export function readSessions(storage) {
  const raw = storage.getItem(KEY);
  if (!raw) return [createSession()];
  const data = JSON.parse(raw);
  if (!Array.isArray(data) || !data.every(validImport))
    throw new Error("El respaldo local no es válido.");
  return data;
}
export function writeSessions(storage, sessions) {
  storage.setItem(KEY, JSON.stringify(sessions));
}
export function mergeImport(current, incoming) {
  if (
    !Array.isArray(incoming) ||
    incoming.length > 500 ||
    !incoming.every(validImport)
  )
    throw new Error("El archivo no contiene sesiones válidas de Impulso.");
  return [
    ...current,
    ...incoming.map((s) => ({
      ...structuredClone(s),
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    })),
  ];
}
