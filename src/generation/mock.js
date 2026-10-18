import { parseInput } from "./contract.js";
const a = (
  name,
  time,
  organization,
  materials,
  execution,
  technique,
  safety,
) => ({ name, time, organization, materials, execution, technique, safety });

// Fixed, curated response fixture. It is deliberately not presented as a general AI generator.
export function mockResponse(value) {
  const input = parseInput(value);
  if (
    input.grade !== 4 ||
    input.duration !== 135 ||
    input.topic.toLocaleLowerCase("es").replace(/[.!]+$/, "") !==
      "fundamentos técnicos del atletismo"
  )
    throw new Error(
      "La simulación solo incluye el caso de prueba: 4.º, «Fundamentos técnicos del atletismo», 135 minutos. La generación de otros temas requiere activar el servicio real.",
    );
  return {
    title: "Corremos con control: fundamentos técnicos del atletismo",
    topic: input.topic,
    competency: 0,
    precise:
      "Coordina la acción alternada de brazos y piernas, una salida de pie y la aceleración progresiva en recorridos de 15 a 20 metros; analiza un aspecto de su técnica y lo ajusta en un segundo intento según sus posibilidades.",
    purpose:
      "Mejorar la técnica básica de carrera, la coordinación de brazos y piernas y las salidas de pie mediante juegos y tareas progresivas, comparando dos ejecuciones para realizar una mejora segura.",
    evidence:
      "Dos recorridos observados de 20 metros que combinan salida de pie, aceleración progresiva y desaceleración; explicación de una corrección aplicada y de dos acuerdos de seguridad.",
    instrument: "Lista de cotejo",
    criteria: [
      "Explica la relación entre el braceo alternado y la coordinación de carrera e identifica dos acuerdos de seguridad para las salidas y la llegada.",
      "Coordina brazos y piernas de forma alternada en un recorrido de 20 metros, con mirada al frente, tronco estable y hombros relajados, según sus posibilidades.",
      "Realiza una salida de pie y acelera progresivamente sin invadir otro carril; aplica en el segundo intento una corrección identificada con su compañero.",
      "Respeta la señal de salida, el turno y la zona de desaceleración; ofrece a su compañero una observación respetuosa basada en los criterios.",
    ],
    transversal: "Gestiona su aprendizaje de manera autónoma",
    transversalCapacities:
      "Define metas de aprendizaje. Organiza acciones estratégicas para alcanzar sus metas. Monitorea y ajusta su desempeño durante el proceso de aprendizaje.",
    transversalAttitude:
      "Elige una meta sobre el braceo o la salida, contrasta dos intentos con ayuda de un observador y explica qué ajuste mejoró su ejecución.",
    approach:
      "Inclusivo o de atención a la diversidad; orientación al bien común",
    attitude:
      "Acepta recorridos y ritmos diferenciados, comparte los implementos y valora las mejoras personales sin comparar velocidades entre estudiantes.",
    adaptations: `Ofrecer marcha rápida o desplazamiento funcional acordado, recorridos de 10 metros, señales visuales y auditivas y tiempos de recuperación mayores. Ajustar el patrón técnico al modo de desplazamiento; observar progreso respecto del primer intento. No imponer carreras máximas ni excluir de la práctica motriz.${input.group ? "\nCaracterísticas declaradas por el docente (requieren contextualización): " + input.group : ""}`,
    notes:
      "Foco de esta sesión: carrera, coordinación, salida de pie y aceleración. Se reservan saltos y lanzamientos para sesiones posteriores: incluirlos ahora reduciría el tiempo de práctica y retroalimentación. Las referencias curriculares son las síntesis editables del proyecto, no citas nuevas del MINEDU.",
    sequence: {
      inicio: [
        a(
          "Mensajeros del ritmo",
          10,
          "Grupos de cuatro en carriles paralelos de 15 metros; salida por turnos y regreso por fuera.",
          "Conos, tarjetas de colores y señal sonora.",
          "Durante 2 minutos explicar que cada color indica caminar, trotar o marchar elevando suavemente rodillas. Jugar 4 rondas de 1 minuto con 30 segundos de recuperación entre las tres primeras. Dedicar los 2 minutos y medio restantes a movilidad dinámica de tobillos, cadera y hombros. La misión es mantener el ritmo y el espacio, no llegar primero.",
          "Alternar brazo contrario a la pierna que avanza. Mantener hombros relajados y mirar al frente; corregir pasos excesivamente largos con una demostración lenta.",
          "Revisar el suelo, retirar obstáculos y mantener distancia. No perseguir ni eliminar participantes. Permitir marcha y pausas de hidratación.",
        ),
        a(
          "¿Qué hace eficiente una carrera?",
          7,
          "Semicírculo frente a un carril de demostración.",
          "Conos y dos tarjetas: brazos rígidos / braceo relajado.",
          "Pedir respuestas: ¿qué hacen nuestros brazos al correr?, ¿cómo cambia el equilibrio al salir? El docente muestra caminando dos variantes de braceo; identificar cuál facilita la coordinación. Plantear el reto: ¿cómo mejorar una salida y una aceleración sin correr al máximo ni perder el control?",
          "Distinguir control técnico de velocidad absoluta. Recuperar experiencias de juegos de carrera sin clasificar a estudiantes por rendimiento.",
          "Demostrar a baja intensidad y fuera de los carriles de práctica. Nadie imita una postura que cause dolor.",
        ),
        a(
          "Nuestra meta y acuerdos de pista",
          8,
          "Parejas: ejecutante y observador; después intercambiar roles.",
          "Lista de cotejo, conos y agua.",
          "Presentar propósito, evidencia y cuatro criterios. Cada pareja elige una meta técnica. Recorrer caminando salida, tramo de 20 metros y zona adicional de 10 metros para desacelerar; acordar señal de salida, regreso lateral y señal de pausa. Ensayar el recorrido caminando.",
          "Asegurar que se comprende el recorrido y cómo observar un solo aspecto por intento. Preguntar al estudiante qué variante necesita.",
          "Un estudiante por carril y turno. No salir hasta que toda la zona esté libre. Usar calzado adecuado, hidratarse y detenerse ante malestar.",
        ),
      ],
      desarrollo: [
        a(
          "Brazos y piernas conversan",
          20,
          "Parejas en carriles de 15 metros; una ejecuta y otra observa desde el lateral.",
          "Conos y tarjetas con los indicadores de braceo.",
          "Explicar y demostrar durante 3 minutos. Practicar 6 minutos de marcha coordinada y trote suave, alternando roles cada recorrido. Realizar 2 minutos de pausa e hidratación. Practicar otros 6 minutos con elevación baja de rodillas y braceo alternado. Usar los 3 minutos finales para señalar una mejora y un ajuste.",
          "Codos flexionados cómodamente, manos sin tensión y brazos hacia delante y atrás, sin cruzar exageradamente el tronco. Reducir la velocidad si se pierde alternancia.",
          "No usar obstáculos ni cargas. Mantener espacio entre parejas; ofrecer marcha o menor distancia. Observar desde fuera del carril.",
        ),
        a(
          "Pisadas ligeras, carrera fluida",
          25,
          "Tríos: ejecutante, observador de braceo y observador de postura, rotando roles.",
          "Conos para 20 metros y zona de desaceleración de 10 metros.",
          "Dedicar 4 minutos a demostrar trote con pasos cortos, tronco estable y hombros relajados. Hacer dos bloques de 7 minutos de recorridos de 20 metros a intensidad moderada, con regreso caminando y rotación de roles. Entre bloques, usar 3 minutos para hidratación y comentarios. En los 4 minutos finales cada estudiante repite un recorrido aplicando una corrección.",
          "Apoyar el pie cerca de la proyección del cuerpo, sin imponer un tipo único de pisada. Evitar inclinarse desde la cintura o mirar al suelo. Usar una consigna a la vez.",
          "No exigir velocidad máxima ni competir por tiempos. Dejar libre la zona de llegada; graduar distancia, intensidad y recuperación según necesidades.",
        ),
        a(
          "Despegue progresivo",
          25,
          "Parejas distribuidas en carriles, salida individual de pie; docente en la zona de salida.",
          "Conos, marcas de salida y tarjetas de observación.",
          "Explicar 4 minutos la salida con pies escalonados y rodillas ligeramente flexionadas. Ensayar caminando 4 minutos. Practicar 6 minutos salidas de pie y aceleración progresiva de 15 metros; recuperar caminando. Pausa de 3 minutos. Practicar otros 5 minutos hasta 20 metros, alternando observador y ejecutante. Cerrar con 3 minutos de comentarios sobre la meta personal.",
          "Inclinar levemente el cuerpo como conjunto al iniciar y elevarlo de forma gradual. Dar pasos iniciales controlados y coordinar el braceo contrario. Si hay desequilibrio, acortar el recorrido y repetir lentamente.",
          "Sin tacos de salida, empujones ni salidas agachadas exigidas. Señal solo cuando el carril esté libre; desacelerar durante 10 metros antes de detenerse.",
        ),
        a(
          "Laboratorio de mejora: observo, ajusto y repito",
          25,
          "Tríos con rotación: ejecutante y dos observadores laterales; docente registra la lista de cotejo.",
          "Conos, fichas con los criterios y lápices.",
          "Organizar durante 3 minutos. Durante 7 minutos, cada estudiante realiza una salida de pie y un recorrido de 20 metros; los observadores anotan un indicador de coordinación y otro de aceleración. Usar 3 minutos para hidratación y elección de una corrección. Repetir durante 7 minutos aplicando el ajuste. Dedicar 5 minutos a comparar intentos y registrar evidencias del progreso individual.",
          "Dar retroalimentación concreta, por ejemplo «afloja los hombros y lleva los brazos en dirección de la carrera». Mantener la misma distancia e intensidad entre intentos para valorar el ajuste técnico.",
          "Recuperación caminando entre intentos y sin cronometraje competitivo. No sobrecargar al estudiante para completar una cantidad fija de repeticiones. Adaptar el recorrido y mantener la zona de frenado libre.",
        ),
      ],
      cierre: [
        a(
          "Aplicación: mi salida con una mejora",
          4,
          "Parejas en los mismos carriles, un recorrido por estudiante, observador al costado.",
          "Conos y lista de cotejo.",
          "Aplicar el ajuste elegido en una última salida de pie y un recorrido de 15 metros a intensidad cómoda. El compañero identifica la mejora y el docente recoge una evidencia. Explicar cómo usar el control de salida y frenado en un juego de persecución sin realizarlo todavía.",
          "Priorizar una salida equilibrada, coordinación y frenado gradual. No buscar récords al final de la sesión.",
          "Solo una ejecución cómoda, con descanso previo. Sustituir por marcha si hay fatiga; mantener la zona libre y el regreso lateral.",
        ),
        a(
          "Recuperamos el ritmo de la respiración",
          5,
          "Grupo disperso con espacio personal.",
          "Espacio libre y agua.",
          "Caminar suavemente 2 minutos; movilizar hombros, tobillos y piernas durante 2 minutos; dedicar 1 minuto a respiración tranquila e hidratación. Reconocer cómo disminuye el esfuerzo.",
          "Respiración sin retenciones y movilidad de amplitud cómoda. Evitar rebotes y estiramientos intensos.",
          "No pasar bruscamente de carrera a inmovilidad. Ante dolor o malestar, detener la actividad y aplicar los protocolos de la institución.",
        ),
        a(
          "Lo que cambió entre mis dos intentos",
          6,
          "Círculo de diálogo y autoevaluación individual.",
          "Lista de cotejo y tarjeta de salida.",
          "Preguntar: ¿qué cambió en tu braceo?, ¿cómo controlaste la aceleración?, ¿qué acuerdo hizo segura la llegada? Cada estudiante se autoevalúa con los cuatro criterios y escribe un logro, una evidencia y una meta. El docente ofrece retroalimentación específica y anticipa que saltos y lanzamientos se abordarán con tiempo propio en futuras sesiones.",
          "Relacionar cada comentario con la ejecución observada. Aceptar distintos patrones funcionales y evaluar progreso, no diferencias de velocidad.",
          "Evitar comparaciones entre cuerpos o tiempos. No solicitar prácticas de alta intensidad sin supervisión como tarea.",
        ),
      ],
    },
  };
}
