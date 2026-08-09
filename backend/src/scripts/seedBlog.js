// Uso: npm run seed-blog
// Carga artículos de ejemplo para la sección /blog. Es upsert por slug,
// así que se puede correr de nuevo sin duplicar contenido.
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/mongo.js";
import Post from "../models/post.js";

const posts = [
  {
    title: "Cómo elegir el alimento balanceado ideal para tu perro",
    slug: "como-elegir-alimento-balanceado-para-perros",
    excerpt:
      "Edad, tamaño y nivel de actividad son las tres variables clave para no equivocarte al elegir el balanceado de tu perro.",
    coverImage:
      "https://res.cloudinary.com/dxognqhnp/image/upload/v1739553207/alimento-perro_n9wqdw.webp",
    coverImageAlt: "Bolsa de alimento balanceado premium para perros adultos",
    author: "Equipo Petshop",
    published: true,
    sections: [
      {
        anchor: "edad-y-etapa",
        heading: "Elegí según la etapa de vida",
        content:
          "Los cachorros necesitan más proteína y calorías para crecer, los adultos requieren una fórmula de mantenimiento, y los perros senior se benefician de alimentos con menos calorías y suplementos para las articulaciones. Usar el balanceado de la etapa equivocada puede generar sobrepeso o carencias nutricionales.",
      },
      {
        anchor: "tamano-de-raza",
        heading: "El tamaño de la raza también importa",
        content:
          "Las razas pequeñas tienen un metabolismo más acelerado y necesitan croquetas más pequeñas y calóricamente más densas. Las razas grandes, en cambio, se benefician de fórmulas que cuidan las articulaciones y regulan el crecimiento óseo para evitar displasias.",
      },
      {
        anchor: "nivel-de-actividad",
        heading: "Nivel de actividad y condición corporal",
        content:
          "Un perro muy activo o de trabajo quema más energía que uno sedentario, así que puede necesitar un alimento con mayor densidad calórica. Revisá periódicamente la condición corporal de tu perro (que se le sientan las costillas sin apretar demasiado) para ajustar la porción diaria.",
      },
      {
        anchor: "transicion",
        heading: "Cómo hacer la transición de alimento",
        content:
          "Cambiar de balanceado de un día para el otro puede causar problemas digestivos. Lo ideal es mezclar gradualmente el alimento nuevo con el anterior durante 7 a 10 días, aumentando la proporción del nuevo cada día hasta reemplazarlo por completo.",
      },
    ],
  },
  {
    title: "Cuidado dental en gatos: guía completa",
    slug: "cuidado-dental-en-gatos-guia-completa",
    excerpt:
      "La salud bucal de los gatos suele pasar desapercibida hasta que aparece el dolor. Estos hábitos ayudan a prevenirlo.",
    coverImage:
      "https://res.cloudinary.com/dxognqhnp/image/upload/v1742396406/raton-sisal-small-31-7dfd80cec19ea0748a16787266030818-1024-1024_krcmcw.jpg",
    coverImageAlt: "Gatito jugando, ejemplo de mascota con buena salud general",
    author: "Equipo Petshop",
    published: true,
    sections: [
      {
        anchor: "senales-de-alerta",
        heading: "Señales de que algo no está bien",
        content:
          "Mal aliento persistente, dificultad para comer, babeo excesivo o encías rojas e inflamadas son señales de que tu gato puede tener una enfermedad periodontal. Ante cualquiera de estos síntomas, lo recomendable es consultar al veterinario.",
      },
      {
        anchor: "cepillado",
        heading: "Cepillado: el hábito más efectivo",
        content:
          "El cepillado regular con cepillo y pasta dental especial para gatos (nunca pasta de uso humano) es la forma más efectiva de prevenir sarro. Lo ideal es empezar de a poco, en sesiones cortas, para que el gato lo asocie con algo positivo.",
      },
      {
        anchor: "alimentacion-y-snacks",
        heading: "Alimentación y snacks dentales",
        content:
          "Existen alimentos balanceados y snacks formulados específicamente para reducir la acumulación de sarro mientras el gato mastica. No reemplazan el cepillado, pero son un buen complemento dentro de la rutina de cuidado.",
      },
      {
        anchor: "control-veterinario",
        heading: "Controles veterinarios periódicos",
        content:
          "Una revisión dental anual permite detectar problemas antes de que se vuelvan dolorosos o requieran extracciones. En gatos mayores de 7 años, se recomienda aumentar la frecuencia de estos controles.",
      },
    ],
  },
  {
    title: "5 consejos para la primera visita al veterinario",
    slug: "5-consejos-primera-visita-al-veterinario",
    excerpt:
      "Llevar a tu mascota al veterinario por primera vez puede ser estresante para ambos. Estos tips hacen que la experiencia sea más tranquila.",
    coverImage:
      "https://res.cloudinary.com/dxognqhnp/image/upload/v1739813712/caja-transportadora_wweygl.webp",
    coverImageAlt: "Caja transportadora para el traslado seguro de mascotas",
    author: "Equipo Petshop",
    published: true,
    sections: [
      {
        anchor: "elegir-transportadora",
        heading: "1. Elegí una transportadora cómoda",
        content:
          "Una caja transportadora bien ventilada y del tamaño adecuado reduce el estrés del viaje, tanto para perros pequeños como para gatos. Dejarla abierta en casa unos días antes, con una manta y algún snack adentro, ayuda a que la mascota la asocie con un lugar seguro.",
      },
      {
        anchor: "documentacion",
        heading: "2. Llevá el carnet de vacunación",
        content:
          "Si tu mascota ya recibió alguna vacuna o desparasitación, llevá el registro. Le va a servir al veterinario para armar un historial completo y planificar el calendario de vacunación a futuro.",
      },
      {
        anchor: "ayuno-previo",
        heading: "3. Consultá si hace falta ayuno previo",
        content:
          "Para algunos estudios de rutina (como análisis de sangre) puede pedirse ayuno de varias horas. Preguntá al pedir el turno si tu mascota necesita algún preparativo especial antes de la consulta.",
      },
      {
        anchor: "mantener-la-calma",
        heading: "4. Mantené la calma vos también",
        content:
          "Las mascotas perciben el estrés de sus dueños. Hablarle con un tono tranquilo y evitar apurar el proceso ayuda a que la visita sea menos traumática, sobre todo en la primera consulta.",
      },
      {
        anchor: "preguntas-frecuentes",
        heading: "5. Llevá una lista de preguntas",
        content:
          "Anotá de antemano cualquier duda sobre alimentación, comportamiento o cuidados generales. La primera consulta es un buen momento para resolver todas esas preguntas con el profesional.",
      },
    ],
  },
];

await connectDB();

for (const post of posts) {
  await Post.updateOne({ slug: post.slug }, { $set: post }, { upsert: true });
  console.log(`OK: ${post.title}`);
}

console.log(`Listo: ${posts.length} artículos cargados/actualizados.`);
await mongoose.disconnect();
