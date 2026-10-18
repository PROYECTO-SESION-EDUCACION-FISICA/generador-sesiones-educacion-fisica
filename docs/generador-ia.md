# Generador de sesiones: simulación y activación pendiente

## Estado de esta entrega

- **Funciona sin cuentas ni consumos de API:** Nueva sesión → Generar sesión con IA → Simulación local → Generar sesión.
- Caso disponible: **4.º de secundaria, Fundamentos técnicos del atletismo, 135 minutos**. Es una respuesta de prueba fija, identificada como simulación; no es un modelo local ni genera otros temas. El formulario rechaza otros casos en este modo en vez de sustituirlos por gimnasia.
- Foco pedagógico: técnica de carrera, coordinación de brazos y piernas, salida de pie y aceleración progresiva. Saltos y lanzamientos quedan para sesiones posteriores para preservar tiempo suficiente de práctica y retroalimentación.
- Inicio 25, desarrollo 95 y cierre 15 minutos. Incluye cuatro criterios, evidencias, transversales, seguridad, adaptaciones y lista de cotejo editable mediante el editor actual.
- Abre una sesión nueva como borrador. Se edita, guarda, recupera y exporta con las funciones existentes. La indicación de simulación queda en las observaciones y en las exportaciones.
- **La generación real está bloqueada en el cliente y en el servidor. No se han creado cuentas, desplegado Workers, activado facturación ni hecho llamadas a OpenAI.**

Las características opcionales del grupo se conservan en las adaptaciones del ejemplo para que el docente lo contextualice. La simulación no reescribe automáticamente las actividades según ese texto. No introducir nombres, diagnósticos ni datos identificables de estudiantes.

## Arquitectura mínima

```text
GitHub Pages / formulario existente
  ├─ simulación → respuesta local de atletismo → validación → editor
  └─ real (desactivado) → HTTPS /generate en Cloudflare Worker
       → origen permitido + código privado + validación de entrada
       → reserva global persistente (Durable Object SQLite)
       → OpenAI Responses API, salida JSON estricta
       → validación de estructura y minutos
       → validación nuevamente en navegador → editor
```

No se mueve el sitio de GitHub Pages. No se cambian el almacenamiento, las plantillas, los datos curriculares, los documentos ni los formatos de exportación. El modelo elige un índice de competencia; la aplicación toma del proyecto la referencia curricular del grado y las capacidades, sin permitir que el modelo las reemplace por supuestas citas del MINEDU. Las nuevas precisiones y actividades son propuestas docentes, no contenido oficial certificado. La validación estructural no sustituye la revisión pedagógica.

La única configuración pública nueva es `src/generation/config.js`: habilitación y URL HTTPS, sin secretos. El código de acceso al generador se introduce manualmente en modo real y no se persiste en localStorage ni en la sesión guardada; **no es la clave API de OpenAI**. Esta primera versión prevé uso privado con código compartido por el propietario; para acceso público multiusuario se requerirá autenticación individual antes de ampliarla.

## Controles de consumo preparados

Todos los siguientes controles son del **servidor** y no dependen de una restricción del formulario:

- `GENERATION_ENABLED = "false"` por defecto, comprobado antes de llamar al proveedor.
- Modelo fijo `gpt-4.1-mini`; el navegador no puede cambiar modelo, herramientas, instrucciones ni límite de salida.
- **5 intentos diarios y 50 mensuales en total**, por calendario UTC, para toda la instancia. Mínimo 15 segundos entre reservas. La cuota no se multiplica por dispositivo ni por dirección IP.
- Reserva atómica en un Durable Object SQLite: controla concurrencia y sobrevive a reinicios. Si el contador no está disponible se rechaza la generación.
- Cada intento reservado cuenta aunque falle o se cancele, ya que el proveedor puede haber realizado trabajo. No se reintenta automáticamente ni se devuelve la reserva; se prioriza limitar el gasto.
- Máximo **8000 tokens de salida**, cuerpo enviado al proveedor limitado a 18 000 bytes, tema de hasta 180 caracteres y grupo de hasta 800. Duración admitida: enteros de 30 a 240 minutos.
- Timeout de proveedor 55 segundos y cliente 65 segundos; cancelar la interfaz evita incorporar resultados tardíos, pero no garantiza que el proveedor deje de facturar trabajo ya iniciado.
- Respuestas truncadas, rechazos, campos vacíos, campos inesperados, tiempos no enteros y sumas distintas a la duración se rechazan, sin guardar ni modificar la biblioteca.
- Origen exacto y código de acceso privado de al menos 32 caracteres. CORS por sí solo no es autenticación: el código privado es obligatorio. No se registran claves, prompts ni respuestas en los logs de la aplicación.

Estas cuotas son límites de solicitudes, **no un tope contractual de facturación en dólares**. Los precios pueden cambiar y otros proyectos pueden consumir la misma cuenta. Antes de activar, configurar también las restricciones o créditos disponibles en la cuenta del proveedor; no depender solo de alertas de presupuesto. Mantener Workers en Free, sin actualización automática a un plan de pago. Rotar el código privado si se comparte por error. No renombrar el Durable Object ni su identificador para reiniciar cuotas.

## Costo aproximado de una sesión de 135 minutos

Tarifas de referencia consultadas el **18 de octubre de 2026** para GPT-4.1 mini: **US$0,40 por millón de tokens de entrada** y **US$1,60 por millón de tokens de salida**, sin aplicar descuentos por caché. [Fuente oficial](https://developers.openai.com/api/docs/models/gpt-4.1-mini).

Ejemplo de cálculo, todavía **sin medición real**:

| Supuesto                                     | Cálculo                 | Costo aproximado |
| -------------------------------------------- | ----------------------- | ---------------- |
| 5000 tokens de entrada                       | 5000 × 0,40 / 1 000 000 | US$0,0020        |
| 4000 tokens de salida                        | 4000 × 1,60 / 1 000 000 | US$0,0064        |
| Total por sesión                             | Entrada + salida        | **US$0,0084**    |
| Salida extensa de 8000 tokens, misma entrada | 0,0020 + 0,0128         | **US$0,0148**    |

Para planificar, considerar **aproximadamente US$0,01–0,02 por intento** (uno a dos centavos de dólar), sin impuestos y sujeto al volumen real de tokens y al precio vigente. Cincuenta intentos a ese rango representarían aproximadamente US$0,50–1,00 de API; no es una garantía ni un presupuesto autorizado. Los 135 minutos son duración de clase, no duración de uso de la API. Antes de autorizar uso habitual se debe medir una llamada real autorizada y actualizar la estimación con sus tokens efectivos.

Cloudflare Workers y Durable Objects SQLite disponen de cuotas gratuitas. Para este piloto pequeño se propone mantenerse dentro de ellas: si se agotan, el servicio debe fallar en lugar de contratar un plan. [Workers](https://developers.cloudflare.com/workers/platform/pricing/) · [Durable Objects](https://developers.cloudflare.com/durable-objects/platform/pricing/). No se promete que la API de OpenAI sea gratuita ni se presupone que una suscripción de ChatGPT cubra este consumo.

Alternativas sin gasto de API hoy: usar la simulación incluida o continuar con las plantillas y la edición manual. Otras API con promociones o modelos locales requerirían evaluación y adaptación; no están integrados ni se han activado.

## Pasos mínimos de activación, solo después de autorización expresa

1. Confirmar las cuentas de Cloudflare y OpenAI API, el modelo disponible y el presupuesto autorizado. Verificar precios vigentes y los límites de Free. Revisar primero el PR, sin necesidad de publicar para probar la simulación.
2. Configurar `backend/wrangler.toml`: `ALLOWED_ORIGIN` debe ser el origen HTTPS real de GitHub Pages (por ejemplo, `https://usuario.github.io`, **sin** ruta del repositorio). Mantener inicialmente `GENERATION_ENABLED = "false"`.
3. Desde un entorno privado con Wrangler, crear los secretos del Worker mediante los prompts de `wrangler secret put OPENAI_API_KEY --config backend/wrangler.toml` y `wrangler secret put ACCESS_TOKEN --config backend/wrangler.toml`. El segundo valor es un código aleatorio independiente de al menos 32 caracteres, no la clave API. No guardarlos en el repositorio, GitHub Pages o esta conversación. Estos comandos son instrucciones futuras; no se han ejecutado.
4. Desplegar el Worker y su migración SQLite **solo cuando se autorice desplegar**. La configuración ya declara el Durable Object. Con el interruptor en falso, la ruta `/generate` debe responder 503 sin consumo. La prueba de compilación local utiliza `wrangler deploy --dry-run`, que no publica.
5. Cuando se autorice expresamente el consumo: cambiar `GENERATION_ENABLED` a `"true"` y desplegar ese cambio; configurar `realEnabled: true` y `endpoint: 'https://<worker>/generate'` en `src/generation/config.js`. Publicar el cambio de frontend solamente con autorización. La URL es pública; nunca incluir secretos en ella.
6. Introducir el código privado en el formulario, realizar **un** intento real autorizado con atletismo, revisar contenido, minutos, exportaciones y consumo observado. Hasta entonces, la integración con el proveedor sigue sin validación real.

Para desactivar nuevas generaciones reales basta volver a `GENERATION_ENABLED = "false"` en el Worker y aplicar ese cambio. Conservar el código de acceso solo durante su uso; el formulario lo elimina al cerrarse. No activar servicios de pago ni ejecutar los pasos de despliegue por el mero hecho de integrar el PR.

## Archivos y verificación

- `src/app.js`: opción de generación y formulario, carga, cancelación y errores; entrega al editor existente.
- `src/generation/contract.js`: contrato compartido, validación y adaptación de metadatos.
- `src/generation/mock.js`: respuesta simulada de atletismo independiente de gimnasia.
- `src/generation/client.js`, `config.js`: cliente con modo real bloqueado.
- `backend/prompt.js`, `worker.js`, `wrangler.toml`: preparación del proveedor y controles de seguridad y cuota.
- `tests/generation.test.mjs`, `tests/worker.test.mjs`: transporte sustituido localmente; nunca consumen OpenAI.
- `package.json`: incorpora las pruebas nuevas sin añadir dependencias de ejecución.
- `.gitignore`: excluye archivos de secretos y estado local de Wrangler.

`npm test` ejecuta 32 pruebas (10 existentes y 22 nuevas). `npm run build` genera el sitio estático y no incluye `backend/`. También se verificaron en Chromium el caso obligatorio, rechazo de casos no simulados, edición, guardado y recuperación tras recarga, ambos formatos, Word, apertura de impresión y PDF con Chromium, adición y eliminación de actividades y ancho móvil, sin solicitudes externas. La apertura en Microsoft Word de escritorio no se ha comprobado.

Se verificó la compilación del Worker con Wrangler en `--dry-run` y su ejecución local en workerd/Miniflare, sustituyendo completamente la salida al proveedor. La prueba local confirma el bloqueo por defecto y las reservas concurrentes en un Durable Object SQLite. Esto **no equivale a una prueba en Cloudflare desplegado ni en OpenAI real**. No hay una URL del backend publicada en esta entrega.
