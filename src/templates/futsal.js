import { competencies } from "../data.js";

const activity = (
  name,
  time,
  organization,
  materials,
  execution,
  technique,
  safety,
) => ({ name, time, organization, materials, execution, technique, safety });

// Fixed teacher-authored template; no API, network requests or changes to the gymnastics template.
export function createFutsalSession() {
  return {
    id: crypto.randomUUID(),
    title: "Perfeccionamiento del dominio y conducción del balón (FUTSAL)",
    topic: "Futsal · dominio y conducción del balón",
    grade: 5,
    section: "",
    institution: "",
    teacher: "",
    date: "",
    duration: 135,
    competency: 0,
    performance: competencies[0].performances[5],
    precise:
      "Combina controles con planta, interior y exterior del pie y conduce el balón con ambos pies en trayectos, cambios de dirección y situaciones de oposición regulada; ajusta la superficie de contacto y la distancia del balón según el espacio disponible, y mejora su ejecución a partir de la observación de dos intentos.",
    purpose:
      "Perfeccionar el dominio y la conducción del balón de futsal mediante controles orientados, uso de ambos pies, cambios de dirección y protección sin contacto; decidir cuándo acercar o adelantar el balón y aplicar una corrección técnica que favorezca el control y la seguridad.",
    evidence:
      "Dos ejecuciones de un circuito que integra cinco contactos alternados por pie, conducción entre cuatro conos y cambio de dirección; aplicación de control y conducción hacia una puerta libre en un juego de oposición regulada. Explicación de una decisión técnica y una mejora entre intentos, registradas en la lista de cotejo.",
    instrument: "Lista de cotejo",
    criteria: [
      "Explica cuándo usar planta, interior o exterior y cuándo acortar o ampliar los contactos al conducir, relacionando su elección con el espacio, la cercanía del oponente y dos acuerdos de seguridad.",
      "Realiza cinco contactos controlados con cada pie de forma alternada y conduce entre cuatro conos con interior o exterior, manteniendo el balón a una distancia que permite el siguiente contacto sin perseguirlo y levantando la mirada para reconocer el espacio.",
      "Encadena control orientado, conducción y cambio de dirección hacia una puerta libre ante oposición regulada; protege el balón sin contacto y aplica en el segundo intento una corrección identificada con su compañero.",
      "Respeta turnos, límites y la prohibición de contacto, adapta la intensidad a su compañero y brinda una observación técnica respetuosa sin excluir a nadie por su nivel de dominio.",
    ],
    transversal: "Gestiona su aprendizaje de manera autónoma",
    transversalCapacities:
      "Define metas de aprendizaje. Organiza acciones estratégicas para alcanzar sus metas. Monitorea y ajusta su desempeño durante el proceso de aprendizaje.",
    transversalAttitude:
      "Elige una meta sobre su pie menos hábil, la distancia del balón o la mirada; observa el primer intento con su compañero, selecciona una corrección y valora el cambio en el segundo.",
    approach:
      "Inclusivo o de atención a la diversidad; orientación al bien común",
    attitude:
      "Acepta diferencias de experiencia, comparte balones y roles de práctica, ajusta la oposición para que todos participen y cuida el espacio común y los materiales.",
    adaptations:
      "Acordar variantes según las posibilidades individuales: balón más blando o de mayor tamaño, marcha en lugar de trote, conos más separados y puertas más anchas, apoyo estable para controles o conducción con el recurso funcional acordado. Reducir a tres contactos por pie o a dos conos cuando corresponda y registrar la variante en la lista de cotejo; valorar el progreso personal sin comparar velocidades. Ampliar descansos y ofrecer señales visuales además de auditivas. El rol de observador es rotativo y no reemplaza de forma permanente la participación motriz.",
    notes:
      "Propuesta docente de 5.º de secundaria basada en la competencia y la síntesis curricular editable ya incluidas en IMPULSO; el desempeño precisado y las actividades no son citas textuales del MINEDU. Revisar piso, calzado y presión de los balones. Distribuir idealmente un balón por pareja; con menos material, usar tríos y alternar recorridos breves, observación y ensayo del gesto sin balón. Los tiempos incluyen explicación, hidratación, organización y transiciones. No se evalúa rapidez, cantidad de goles ni dominio acrobático.",
    folder: "Futsal",
    status: "Borrador",
    favorite: false,
    updatedAt: new Date().toISOString(),
    sequence: {
      inicio: [
        activity(
          "GPS del balón: encuentra una ruta segura",
          8,
          "Parejas, un balón por pareja, en cuadrados de aproximadamente 6 × 6 metros; ampliar o reducir el número de parejas para evitar cruces. Un guía camina por delante y el compañero conduce; cambian de rol.",
          "Balones de futsal o de bajo rebote, conos y tarjetas de colores.",
          "Explicar durante 2 minutos: verde significa avanzar caminando con contactos cortos; amarillo, cambiar de dirección con interior o exterior; rojo, detener suavemente con la planta. Realizar cuatro rondas de 1 minuto alternando roles, con 30 segundos de cambio entre las tres primeras. En los 30 segundos finales preguntar qué hicieron para conservar el balón y evitar choques. El objetivo colectivo es encontrar rutas libres, no perseguir ni eliminar jugadores.",
          "Rodillas ligeramente flexionadas, pie de apoyo estable y contactos suaves. Alternar ambos pies y levantar la mirada entre contactos; si el balón se aleja, reducir el ritmo y acercar los toques.",
          "No correr ni pisar el balón con todo el peso corporal. Mantener distancia de dos metros cuando sea posible y frenar ante otra pareja; retirar inmediatamente balones sueltos de zonas de paso.",
        ),
        activity(
          "Activación específica: cuerpo y balón se preparan",
          10,
          "Parejas en carriles paralelos de 8 a 10 metros, con retorno lateral y roles alternados; todos se desplazan a intensidad cómoda.",
          "Conos, un balón por pareja y agua.",
          "Dedicar 3 minutos a caminar y trotar suavemente sin balón; 3 minutos a movilidad dinámica de tobillos, rodillas, cadera y hombros; 3 minutos a rodar el balón con la planta, alternar contactos interiores y conducir caminando con cambio de pie cada dos contactos. Utilizar el último minuto para hidratación y organización. El compañero sin balón acompaña a distancia y ensaya el gesto, sin estorbar al conductor.",
          "Apoyar el pie cerca del balón, flexionar rodillas de manera cómoda y distribuir el peso sin rigidez. La planta acompaña el rodamiento sin saltar sobre el balón; evitar bloquear las rodillas.",
          "Comprobar calzado y superficie seca, sin rebotes ni estiramientos forzados. Reducir amplitud y ritmo ante fatiga; detenerse ante dolor y aplicar el protocolo de la institución.",
        ),
        activity(
          "Saberes previos, reto y meta personal",
          7,
          "Semicírculo frente a una demostración breve; después, parejas de observación.",
          "Balón, dos conos y lista de cotejo.",
          "En 2 minutos recuperar saberes: ¿qué diferencia hay entre dominar y conducir?, ¿cuándo conviene usar la planta y cuándo el interior o exterior?, ¿qué ocurre si miramos solo el balón? Dedicar 2 minutos al reto: ¿cómo conservar el control y elegir una ruta libre frente a un oponente sin aumentar el contacto ni depender solo de la velocidad? En 3 minutos presentar propósito, evidencia y cuatro criterios; cada estudiante elige una meta y acuerdan señal de pausa, regreso lateral y ausencia de contacto.",
          "Mostrar lentamente un control orientado que deja el balón hacia el espacio libre. Relacionar la meta con una corrección observable, por ejemplo contactos más cortos o mirar antes del cambio de dirección.",
          "Realizar la demostración en una zona libre; no pedir entradas, barridas ni giros violentos. Acordar variantes para distintas experiencias y necesidades antes de iniciar.",
        ),
      ],
      desarrollo: [
        activity(
          "Laboratorio de contactos: los dos pies deciden",
          15,
          "Parejas en zonas individuales de 3 × 3 metros. Uno trabaja y otro observa desde el borde; alternan cada secuencia breve.",
          "Un balón por pareja, conos y tarjeta de tres superficies de contacto.",
          "Usar 2 minutos para demostrar. Durante 4 minutos practicar cinco contactos alternados con cada pie usando interiores, y luego rodar suavemente con la planta y recibir con el interior contrario. Pausa de 1 minuto. Durante 5 minutos encadenar planta, interior y exterior con desplazamiento de uno o dos pasos, cambiando de rol cada 45 a 60 segundos. Dedicar 3 minutos a que cada observador nombre un logro, sugiera un ajuste y permita un reintento. No se exige mantener el balón en el aire.",
          "Flexionar ligeramente la pierna de apoyo, relajar el tobillo según la acción y dosificar el contacto. Evitar golpear con la punta por apuro o cargar el peso sobre el balón; empezar despacio con el pie menos hábil.",
          "Trabajar sin oposición ni contacto. Los balones permanecen dentro de la zona y no se recuperan atravesando otra pareja. Ofrecer apoyos estables y balones blandos cuando se necesiten.",
        ),
        activity(
          "Carriles de precisión: conducir y mirar",
          20,
          "Tríos en carriles de 12 a 15 metros, con cuatro conos separados aproximadamente dos metros y una zona final de frenado. Roles: ejecutante, observador lateral y encargado de tarjeta; todos rotan.",
          "Un balón por trío, cuatro conos por carril y tarjetas de colores o números.",
          "Explicar y recorrer caminando durante 3 minutos. Realizar un bloque de 6 minutos: conducir en zigzag con ambos pies, detener con planta al final y volver por fuera. El observador muestra una tarjeta a mitad del recorrido para que el ejecutante la identifique sin perder el control. Pausa de 2 minutos. Segundo bloque de 6 minutos alternando el pie que inicia cada cambio y aplicando una corrección. Cerrar con 3 minutos para comentar qué distancia del balón permitió mirar y conservarlo.",
          "Contactos cortos cerca de conos y ligeramente más amplios en el tramo libre. Orientar el cuerpo hacia la salida del giro y mirar el siguiente espacio; si se pierde precisión, aumentar la separación de conos y caminar.",
          "Un ejecutante por carril; salir solo cuando la llegada esté libre. Sin cronometraje competitivo, golpes fuertes ni retornos por el carril activo. El observador permanece fuera del recorrido.",
        ),
        activity(
          "Puertas cambiantes: controlo y elijo",
          20,
          "Tríos en cuadrados de 8 × 8 metros con tres puertas de conos. Un compañero rueda el balón suavemente, otro controla y conduce y el tercero observa; rotación en cada intento.",
          "Un balón por trío, seis conos y tarjetas que indican puertas.",
          "Destinar 3 minutos a demostrar control con planta o interior y salida orientada. Durante 6 minutos recibir un balón rodado desde dos o tres metros, identificar la puerta indicada y conducir hacia ella con cambio de dirección; frenar antes de salir del cuadrado. Hidratarse y comentar durante 2 minutos. Repetir 6 minutos con señal visual dada después de la recepción, alternando pie de control y de salida. Usar 3 minutos para explicar cuándo convino cada superficie y qué ajuste se hará en la siguiente tarea.",
          "Amortiguar el balón en lugar de devolverlo de golpe. Primer contacto hacia la ruta libre y balón a distancia de siguiente toque. Separar percepción, elección y ejecución a ritmo cómodo antes de aumentar la dificultad.",
          "Solo pases rodados y suaves, sin tiros ni portería. Mantener libres las puertas y permitir una salida amplia. No introducir señales que obliguen a giros bruscos; simplificar a dos puertas si es necesario.",
        ),
        activity(
          "Sombra inteligente: protejo sin chocar",
          20,
          "Tríos en pasillos de aproximadamente 8 × 4 metros, dos puertas al fondo y un área de frenado. Roles: conductor, sombra y observador.",
          "Un balón por trío, conos, petos y lista de cotejo.",
          "Explicar 3 minutos la oposición regulada. En un primer bloque de 6 minutos la sombra acompaña a un metro, sin intentar quitar el balón: el conductor observa, cambia de dirección y lo mantiene del lado alejado. Pausa de 2 minutos para hidratación y ajuste. En un segundo bloque de 6 minutos la sombra ocupa una de las rutas a velocidad de marcha, sin entradas; el conductor elige la otra puerta y termina con control de planta. Alternar roles cada intento y usar los 3 minutos finales para retroalimentación sobre protección y elección de ruta.",
          "Ubicar el cuerpo entre balón y sombra, sin empujar ni abrir los brazos para bloquearla. Mantener el balón cerca al cambiar de dirección y orientar el pie de apoyo hacia la puerta elegida. Si se pierde el control, volver a oposición pasiva.",
          "No robar con contacto, barrerse, cargar, sujetar ni cerrar al conductor contra los conos. La sombra se detiene si no puede mantener distancia. El docente supervisa y ajusta parejas por confianza y experiencia, sin etiquetar niveles.",
        ),
        activity(
          "Circuito de mejora: observo, ajusto y aplico",
          20,
          "Tríos en estaciones equivalentes con recorrido separado: dominio, cuatro conos y dos puertas de salida. El docente recorre las estaciones y registra evidencias; compañeros rotan funciones.",
          "Un balón por trío, conos, tarjetas de criterio, lápices y lista de cotejo.",
          "Organizar durante 2 minutos. En 6 minutos cada estudiante realiza un primer recorrido: cinco contactos alternados por pie, zigzag entre cuatro conos, control orientado y salida por una puerta libre ante sombra pasiva. El observador registra un indicador técnico. Usar 2 minutos para hidratación y elegir una corrección. Realizar un segundo bloque de 6 minutos con el ajuste y sombra que ocupa una ruta sin contacto. En los 4 minutos finales comparar intentos, explicar la decisión de superficie y anotar la mejora. Cada recorrido es breve; el tiempo restante del bloque permite rotar y recuperar.",
          "Priorizar continuidad de control, uso de ambos pies, mirada y decisión. Dar una sola consigna por reintento; no exigir mayor rapidez para demostrar progreso. Registrar la variante adaptada si se modifica distancia o número de contactos.",
          "Dejar distancia entre estaciones y una sola ejecución por recorrido. Detener la oposición ante fatiga o pérdida de control; no añadir remates ni entradas. No perseguir un balón que ingrese en otra estación: usar la señal de pausa.",
        ),
      ],
      cierre: [
        activity(
          "Pasaporte técnico: mi control en una situación real",
          4,
          "Parejas con una puerta de conos y zona propia; oposición solo representada por la ubicación del compañero, sin disputa.",
          "Balón, dos conos por pareja y lista de cotejo.",
          "Cada estudiante realiza una aplicación breve y a ritmo cómodo: controla el balón rodado por su compañero, identifica el espacio libre y conduce hasta la puerta cambiando de dirección. Alternan roles. En el tiempo restante explican qué contacto eligieron y qué mejora del circuito aplicaron; el docente recoge evidencias puntuales sin repetir una prueba exhaustiva.",
          "Mirar el espacio antes de orientar el control y terminar con el balón próximo. Usar la corrección personal elegida sin introducir una habilidad nueva.",
          "Sin contacto ni carreras máximas al final de la clase. Si existe fatiga, realizar la aplicación caminando y ampliar la puerta.",
        ),
        activity(
          "El balón también descansa: vuelta a la calma",
          5,
          "Grupo disperso, balones inmovilizados fuera de las zonas de paso.",
          "Conos para estacionar balones y agua.",
          "Caminar suavemente durante 2 minutos; realizar 2 minutos de movilidad y estiramientos suaves de tobillos, pantorrillas, muslos y cadera, con apoyo estable si hace falta. Dedicar 1 minuto a respiración tranquila e hidratación. Reconocer cómo disminuye el esfuerzo.",
          "Amplitud cómoda, sin rebotes ni retener la respiración. No utilizar el balón como apoyo inestable para estirar.",
          "Recoger los balones antes de la relajación. Interrumpir posturas dolorosas y evitar presionar a otro estudiante para aumentar amplitud.",
        ),
        activity(
          "Del intento a la mejora: reflexiono y proyecto",
          6,
          "Círculo de diálogo y luego autoevaluación individual; el compañero aporta una observación respetuosa.",
          "Lista de cotejo y tarjeta de salida.",
          "Durante 2 minutos preguntar: ¿cuándo acercaste el balón y por qué?, ¿qué cambió al usar tu pie menos hábil?, ¿cómo elegiste una ruta sin chocar? Destinar 2 minutos a autoevaluarse con los cuatro criterios, identificar una evidencia entre ambos intentos y recibir retroalimentación docente: logro observado y siguiente paso concreto. En 2 minutos escribir una meta para la próxima sesión y explicar cómo se respetó la participación de todos. No dejar prácticas de oposición sin supervisión como tarea.",
          "Referirse a conductas observables: superficie utilizada, distancia del balón, mirada y respeto de reglas. Valorar el ajuste y la toma de decisiones, sin comparar estudiantes por velocidad o cantidad de goles.",
          "Mantener un clima de respeto, sin burlas por errores ni comparaciones corporales. Nadie está obligado a demostrar ante el grupo para poder reflexionar.",
        ),
      ],
    },
  };
}
