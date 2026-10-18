import { parseInput, toEditorSession } from "./contract.js";
import { mockResponse } from "./mock.js";
import { generationConfig } from "./config.js";
export async function generateSession(
  value,
  {
    mode = "mock",
    accessCode = "",
    signal,
    config = generationConfig,
    fetcher = globalThis.fetch,
  } = {},
) {
  const input = parseInput(value);
  if (signal?.aborted) throw new DOMException("Cancelado", "AbortError");
  if (mode === "mock")
    return toEditorSession(mockResponse(input), input, "mock");
  if (mode !== "real" || config.realEnabled !== true || !config.endpoint)
    throw new Error(
      "La generación real está desactivada. Falta configurar y autorizar los servicios externos.",
    );
  const endpoint = new URL(config.endpoint);
  if (
    endpoint.protocol !== "https:" ||
    endpoint.username ||
    endpoint.password ||
    endpoint.search ||
    endpoint.hash
  )
    throw new Error(
      "El servicio de generación debe usar una URL HTTPS sin credenciales.",
    );
  if (
    typeof accessCode !== "string" ||
    accessCode.length < 32 ||
    accessCode.length > 256
  )
    throw new Error(
      "Introduce el código de acceso privado del generador (no la clave API de OpenAI).",
    );
  let response;
  try {
    response = await fetcher(endpoint.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessCode}`,
      },
      body: JSON.stringify(input),
      signal,
      credentials: "omit",
      redirect: "error",
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(
      "No se pudo conectar con el generador. Revisa tu conexión e inténtalo más tarde.",
    );
  }
  if (!response.ok) {
    const messages = {
      400: "Revisa el grado, el tema y la duración.",
      401: "El código de acceso no es válido.",
      403: "Este sitio no tiene permiso para usar el generador.",
      429: "Se alcanzó la cuota de generación o el intervalo mínimo. Inténtalo más tarde.",
      503: "La generación real todavía no está habilitada.",
      504: "La generación tardó demasiado. No se reintentó automáticamente.",
    };
    throw new Error(
      messages[response.status] ||
        "No se pudo generar una sesión válida. No se guardó ningún cambio.",
    );
  }
  const raw = await response.text();
  if (raw.length > 100000)
    throw new Error("La respuesta del generador excede el tamaño permitido.");
  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    throw new Error("El generador devolvió una respuesta ilegible.");
  }
  return toEditorSession(result.session, input, "real");
}
