export const triviaData = {
  nutricion: [
    {
      text: "¿Cuál de estos alimentos es más rico en proteínas?",
      options: ["Arroz", "Lentejas", "Papas", "Plátano"],
      correctAnswer: "Lentejas",
      explanation: "Las lentejas contienen aproximadamente 9g de proteína por cada 100g, siendo una excelente fuente de proteína vegetal.",
      difficulty: "Fácil",
    },
    {
      text: "¿Qué vitamina se produce principalmente cuando la piel se expone al sol?",
      options: ["Vitamina A", "Vitamina C", "Vitamina D", "Vitamina E"],
      correctAnswer: "Vitamina D",
      explanation: "La vitamina D se produce en la piel cuando se expone a la luz solar, específicamente a los rayos UVB.",
      difficulty: "Fácil",
    },
    {
      text: "¿Cuál es la función principal de la fibra en la dieta?",
      options: ["Proporcionar energía", "Mejorar la digestión", "Construir músculo", "Aumentar la grasa corporal"],
      correctAnswer: "Mejorar la digestión",
      explanation: "La fibra ayuda a mantener el sistema digestivo saludable, facilitando el tránsito intestinal y alimentando a la microbiota intestinal.",
      difficulty: "Moderado",
    },
  ],
  ejercicio: [
    {
      text: "¿Cuál es la recomendación mínima de actividad física semanal para adultos según la OMS?",
      options: ["75 minutos", "150 minutos", "200 minutos", "300 minutos"],
      correctAnswer: "150 minutos",
      explanation: "La OMS recomienda al menos 150 minutos de actividad física aeróbica de intensidad moderada a la semana para adultos.",
      difficulty: "Fácil",
    },
    {
      text: "¿Qué tipo de ejercicio es mejor para aumentar la densidad ósea?",
      options: ["Natación", "Ciclismo", "Yoga", "Levantamiento de pesas"],
      correctAnswer: "Levantamiento de pesas",
      explanation: "Los ejercicios de resistencia como el levantamiento de pesas ayudan a aumentar la densidad ósea al someter a los huesos a un estrés controlado.",
      difficulty: "Moderado",
    },
  ],
  autocuidado: [
    {
      text: "¿Cuántas horas de sueño se recomiendan para un adulto?",
      options: ["4-5 horas", "6-7 horas", "7-9 horas", "10-12 horas"],
      correctAnswer: "7-9 horas",
      explanation: "La mayoría de los adultos necesitan entre 7 y 9 horas de sueño por noche para funcionar óptimamente, según la National Sleep Foundation.",
      difficulty: "Fácil",
    },
  ],
  saludMental: [
    {
      text: "¿Qué es la atención plena o mindfulness?",
      options: [
        "Prestar atención a múltiples tareas a la vez",
        "Concentrarse en el pasado",
        "Prestar atención al momento presente sin juzgar",
        "Planificar el futuro detalladamente",
      ],
      correctAnswer: "Prestar atención al momento presente sin juzgar",
      explanation: "El mindfulness es la práctica de prestar atención deliberadamente al momento presente, aceptando las experiencias sin juzgarlas.",
      difficulty: "Fácil",
    },
  ],
  habitos: [
    {
      text: "¿Cuántos vasos de agua se recomienda beber diariamente?",
      options: ["2-3 vasos", "4-5 vasos", "6-8 vasos", "12-15 vasos"],
      correctAnswer: "6-8 vasos",
      explanation: "Se recomienda consumir aproximadamente 6-8 vasos (1.5-2 litros) de agua al día, aunque las necesidades pueden variar según la actividad física, el clima y otros factores.",
      difficulty: "Fácil",
    },
  ],
};

export const themeNames = {
  nutricion: "Nutrición",
  ejercicio: "Ejercicio", 
  autocuidado: "Autocuidado",
  saludMental: "Salud Mental",
  habitos: "Hábitos Saludables",
};

export function getRecommendations(theme, score) {
  const recommendations = {
    nutricion: {
      low: [
        "Considera incluir más alimentos integrales en tu dieta diaria.",
        "Aprende sobre el balance de macronutrientes (proteínas, carbohidratos y grasas).",
        "Intenta planificar tus comidas con anticipación para asegurar una alimentación balanceada.",
      ],
      medium: [
        "Explora diferentes fuentes de proteínas vegetales si buscas reducir el consumo de carne.",
        "Aprende a leer e interpretar las etiquetas nutricionales de los alimentos.",
        "Considera llevar un diario de alimentación por una semana para identificar patrones.",
      ],
      high: [
        "Profundiza en temas como la nutrición deportiva o la alimentación para condiciones específicas.",
        "Considera compartir tu conocimiento con amigos o familiares interesados en mejorar su alimentación.",
        "Explora la relación entre la nutrición y otros aspectos del bienestar como el sueño o el estado de ánimo.",
      ],
    },
    ejercicio: {
      low: [
        "Comienza con actividades sencillas como caminar 30 minutos diarios.",
        "Aprende sobre los beneficios del ejercicio regular para la salud física y mental.",
        "Establece metas pequeñas y alcanzables para crear un hábito de ejercicio.",
      ],
      medium: [
        "Considera incorporar entrenamiento de fuerza a tu rutina de ejercicios.",
        "Aprende sobre la importancia de la recuperación y el descanso entre sesiones de entrenamiento.",
        "Prueba clases grupales o actividades nuevas para mantener la motivación.",
      ],
      high: [
        "Considera establecer metas más desafiantes como participar en eventos deportivos.",
        "Profundiza en temas como la periodización del entrenamiento o la biomecánica.",
        "Comparte tu conocimiento y pasión por el ejercicio con otros.",
      ],
    },
    autocuidado: {
      low: [
        "Establece una rutina básica de cuidado personal que incluya tiempo para ti mismo cada día.",
        "Aprende técnicas simples de manejo del estrés como la respiración profunda.",
        "Prioriza el sueño estableciendo horarios regulares para acostarte y levantarte.",
      ],
      medium: [
        "Explora prácticas como la meditación o el yoga para el bienestar mental.",
        "Aprende a establecer límites saludables en tus relaciones personales y laborales.",
        "Considera llevar un diario de gratitud o reflexión personal.",
      ],
      high: [
        "Profundiza en prácticas de autocuidado más avanzadas como retiros de silencio o ayuno intermitente.",
        "Explora cómo personalizar tus rutinas de autocuidado según tus necesidades cambiantes.",
        "Comparte tus conocimientos sobre autocuidado con tu comunidad.",
      ],
    },
    saludMental: {
      low: [
        "Aprende a reconocer y nombrar tus emociones como primer paso para gestionarlas.",
        "Establece una práctica diaria de mindfulness, comenzando con solo 5 minutos.",
        "Busca información sobre la conexión entre actividad física y salud mental.",
      ],
      medium: [
        "Explora diferentes técnicas de manejo del estrés para encontrar las que mejor funcionan para ti.",
        "Aprende sobre los patrones de pensamiento negativos y cómo desafiarlos.",
        "Considera establecer límites digitales para reducir la ansiedad relacionada con las redes sociales.",
      ],
      high: [
        "Profundiza en enfoques terapéuticos como la terapia cognitivo-conductual o la aceptación y compromiso.",
        "Explora cómo puedes apoyar a otros en su bienestar mental de manera respetuosa.",
        "Mantente actualizado con las últimas investigaciones en psicología y neurociencia.",
      ],
    },
    habitos: {
      low: [
        "Comienza con un hábito pequeño y fácil de implementar, como beber un vaso de agua al despertar.",
        "Aprende sobre el sistema de señal-rutina-recompensa en la formación de hábitos.",
        "Utiliza recordatorios visuales para ayudarte a mantener tus nuevos hábitos.",
      ],
      medium: [
        "Explora técnicas como el 'apilamiento de hábitos' para integrar nuevas conductas en tu rutina.",
        "Aprende a identificar y modificar los desencadenantes de hábitos no deseados.",
        "Considera llevar un seguimiento de tus hábitos con una aplicación o diario.",
      ],
      high: [
        "Profundiza en la ciencia del cambio de comportamiento y la psicología de los hábitos.",
        "Diseña sistemas personalizados que hagan que tus hábitos positivos sean inevitables.",
        "Explora cómo puedes ayudar a otros a desarrollar hábitos saludables.",
      ],
    },
  };

  let category;
  if (score < 60) {
    category = "low";
  } else if (score < 80) {
    category = "medium";
  } else {
    category = "high";
  }

  return recommendations[theme]?.[category] || [
    "Continúa aprendiendo sobre temas de bienestar y salud.",
    "Considera consultar con profesionales para obtener consejos personalizados.",
    "Mantén una actitud curiosa y abierta hacia nuevos conocimientos en este campo.",
  ];
}