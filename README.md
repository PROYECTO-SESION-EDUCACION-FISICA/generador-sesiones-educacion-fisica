# Impulso · Generador de sesiones de Educación Física

Aplicación web en español para planificar sesiones de Educación Física de 1.º a 5.º de secundaria en el Perú. Interfaz adaptable a escritorio y móvil, sin servicios externos, cuentas ni claves de API.

## Funciones

- Biblioteca con búsqueda, filtros por grado, estado y carpeta, ordenación y favoritas.
- Crear desde una plantilla de gimnasia adaptada al grado o desde una estructura en blanco para cualquier tema.
- Editar datos informativos, competencia y capacidades, síntesis curricular, desempeño precisado, propósito, evidencia y cuatro criterios de evaluación.
- Competencias y enfoques transversales con actuaciones y actitudes observables.
- Añadir, reordenar y eliminar actividades en inicio, desarrollo y cierre. Cada actividad tiene organización, materiales, ejecución, correcciones, seguridad y tiempo.
- Cálculo de tiempos; validación completa antes de marcar como «Lista para usar». Los borradores pueden guardarse incompletos.
- Vista previa de la sesión y ficha de evaluación imprimible.
- Exportar Word compatible (`.doc` basado en HTML), imprimir / guardar PDF desde el navegador y descargar JSON.
- Respaldo de la biblioteca e importación validada sin reemplazar sesiones existentes.
- Aviso al salir del editor con cambios pendientes.

## Ejecución

Requiere Node.js 20 o superior. No requiere instalar dependencias.

```sh
npm run dev
```

Abrir `http://localhost:5173`. El servidor de desarrollo no es un servidor de producción.

```sh
npm test
npm run build
```

`dist/` contiene la aplicación estática lista para cualquier alojamiento HTTPS. Para comprobar la compilación: `node scripts/serve.mjs --dist`.

## Datos y privacidad

La biblioteca se guarda **solo en el navegador y dispositivo actuales**, mediante `localStorage` (clave `impulso.sessions.v1`). No existe sincronización entre equipos, base de datos remota ni autenticación. Borrar los datos del navegador elimina las sesiones. Usar **Respaldar biblioteca** y conservar el JSON fuera del navegador; **Mis sesiones → Importar JSON** lo recupera o traslada a otro equipo. La importación limita el tamaño a 5 MB y valida las estructuras.

No se envían datos docentes a terceros y no se usan fuentes ni scripts remotos. El PDF utiliza el diálogo de impresión: seleccionar «Guardar como PDF». Word abre un `.doc` compatible basado en HTML, no un archivo OOXML `.docx`.

## Sesión de demostración

**Fundamentos técnicos de la gimnasia · 3.º de secundaria · 135 minutos (3 horas pedagógicas).**

- Inicio: 25 minutos, con juego creativo, activación, saberes previos, reto y propósito.
- Desarrollo: 95 minutos, con posiciones básicas, apoyos, equilibrios, combinaciones y circuito de aplicación.
- Cierre: 15 minutos, con recuperación, reflexión y autoevaluación.
- Cuatro criterios: conceptual, dos procedimentales distintos y actitudinal.
- Variantes inclusivas, supervisión, colchonetas y medidas de seguridad; sin inversiones, pirámides ni acrobacias de riesgo.

El mensaje de requisitos recibido terminaba durante la descripción del cierre. Se completó esa sección con reflexión, metacognición y una meta para la siguiente sesión.

## Referencias curriculares

- [Currículo Nacional de la Educación Básica · MINEDU](https://www.minedu.gob.pe/curriculo/pdf/curriculo-nacional-de-la-educacion-basica.pdf).
- [Programa Curricular de Educación Secundaria · MINEDU](https://www.minedu.gob.pe/curriculo/pdf/programa-curricular-educacion-secundaria.pdf), área de Educación Física.
- [Registro del Programa Curricular en el repositorio oficial](https://repositorio.minedu.gob.pe/handle/20.500.12799/4550).

Las competencias y capacidades corresponden al área. **Los desempeños incluidos son síntesis orientativas editables, no transcripciones completas ni un banco oficial exhaustivo.** Las precisiones, criterios y actividades son propuestas docentes. El docente debe contrastar el texto oficial y contextualizar cada sesión. Cambiar el grado o la competencia actualiza la síntesis del desempeño; no reescribe automáticamente las actividades ni los criterios existentes. Las cinco plantillas iniciales de gimnasia sí ofrecen precisiones y metas graduadas. No se utiliza generación por IA.

## Estructura

```text
index.html                 Entrada de la aplicación
src/app.js                 Interfaz y acciones
src/data.js                Competencias, plantillas y validación
src/store.js               Persistencia y respaldos
src/document.js            Documento completo y exportación
src/styles.css             Diseño adaptable
scripts/build.mjs          Compilación estática sin dependencias
scripts/serve.mjs          Servidor local
tests/session.test.mjs      Pruebas de datos, seguridad y exportación
.github/workflows/ci.yml    Pruebas y compilación en GitHub
.github/workflows/pages.yml Publicación manual en GitHub Pages
```

## Publicación con GitHub Pages

El flujo de publicación incluido se ejecuta **manualmente**; no cambia la configuración de acceso del repositorio ni publica al hacer push.

1. En GitHub, activar **Settings → Pages → Source → GitHub Actions** (requiere permisos del repositorio y un plan compatible con su visibilidad).
2. En **Actions → Publicar en GitHub Pages → Run workflow**, elegir la rama con esta aplicación.
3. Al finalizar correctamente, GitHub muestra la URL en el entorno `github-pages`.

La aplicación usa rutas relativas y funciona bajo el subdirectorio del repositorio. Hasta completar ese flujo no hay una URL publicada verificada.

## Verificación

Ocho pruebas automatizadas cubren duración, plantillas de los cinco grados, campos y seguridad de actividades, persistencia, datos corruptos, importación y escape de HTML en exportación. Se verificó además en Chromium: vista de escritorio y móvil, edición persistente, duplicación, filtros de búsqueda, vista previa, Word y creación de sesión.


## Formatos de exportación

En «Vista previa» o «Revisar sesión», seleccionar **Formato de exportación**:
**Institucional en cuadros** o **Descriptivo detallado**. Ambos usan la sesión
actual del editor, incluidos los cambios pendientes de guardar. Se puede elegir
lista de cotejo individual o grupal y añadir el visto bueno de la dirección.
Estas opciones no modifican las sesiones ni el almacenamiento existente.

«Imprimir / Guardar PDF» abre el diálogo del navegador con papel A4. Si los tiempos
no coinciden con la duración total, corregirlos en el editor antes de imprimir.
Las cabeceras de las tablas se repiten y las filas se mantienen juntas cuando
caben en una página; una actividad mayor que una página puede continuar en la
siguiente sin recortar su contenido. La lista grupal incluye diez espacios por
hoja de registro; se pueden imprimir copias adicionales.

Validación de esta mejora: diez pruebas automatizadas, compilación estática y
comprobación en Chromium de ambos formatos, cambios sin guardar, lista grupal,
firmas, pantalla de 390 px y generación de PDF A4 de la sesión de 135 minutos.
Se conserva la descarga Word compatible que ya existía.
