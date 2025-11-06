import { Router } from "express";
import type { Question, Traits } from "../types";

const router = Router();

const questions: Question[] = [
  {
    id: "q1",
    text: "Prefiero explorar ideas nuevas.",
    options: [
      { id: "q1a", label: "Totalmente de acuerdo", trait: "openness" },
      { id: "q1b", label: "De acuerdo", trait: "openness" },
      { id: "q1c", label: "Neutral", trait: "openness" },
      { id: "q1d", label: "En desacuerdo", trait: "openness" },
      { id: "q1e", label: "Totalmente en desacuerdo", trait: "openness" }
    ]
  },
  {
    id: "q2",
    text: "Me gusta organizar y planificar mis tareas.",
    options: [
      { id: "q2a", label: "Totalmente de acuerdo", trait: "conscientiousness" },
      { id: "q2b", label: "De acuerdo", trait: "conscientiousness" },
      { id: "q2c", label: "Neutral", trait: "conscientiousness" },
      { id: "q2d", label: "En desacuerdo", trait: "conscientiousness" },
      { id: "q2e", label: "Totalmente en desacuerdo", trait: "conscientiousness" }
    ]
  },
  {
    id: "q3",
    text: "Disfruto estar rodeado de gente.",
    options: [
      { id: "q3a", label: "Totalmente de acuerdo", trait: "extraversion" },
      { id: "q3b", label: "De acuerdo", trait: "extraversion" },
      { id: "q3c", label: "Neutral", trait: "extraversion" },
      { id: "q3d", label: "En desacuerdo", trait: "extraversion" },
      { id: "q3e", label: "Totalmente en desacuerdo", trait: "extraversion" }
    ]
  },
  {
    id: "q4",
    text: "Me preocupo por los demás y sus sentimientos.",
    options: [
      { id: "q4a", label: "Totalmente de acuerdo", trait: "agreeableness" },
      { id: "q4b", label: "De acuerdo", trait: "agreeableness" },
      { id: "q4c", label: "Neutral", trait: "agreeableness" },
      { id: "q4d", label: "En desacuerdo", trait: "agreeableness" },
      { id: "q4e", label: "Totalmente en desacuerdo", trait: "agreeableness" }
    ]
  },
  {
    id: "q5",
    text: "Me pongo nervioso fácilmente.",
    options: [
      { id: "q5a", label: "Totalmente de acuerdo", trait: "neuroticism" },
      { id: "q5b", label: "De acuerdo", trait: "neuroticism" },
      { id: "q5c", label: "Neutral", trait: "neuroticism" },
      { id: "q5d", label: "En desacuerdo", trait: "neuroticism" },
      { id: "q5e", label: "Totalmente en desacuerdo", trait: "neuroticism" }
    ]
  }
];

// Función para categorizar puntajes
function categorize(score: number): "high" | "low" | "medium" {
  if (score >= 2) return "high";
  if (score <= -1) return "low";
  return "medium";
}

// Perfiles compuestos: combinación de rasgos → personaje
const compositeProfiles = [
  {
    conditions: { openness: "high", agreeableness: "low", extraversion: "low" },
    nombre: "Albert Einstein",
    descripcion: "Tenés una mente abierta, poca empatía y preferís la introspección.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg"
  },
  {
    conditions: { conscientiousness: "high", neuroticism: "low" },
    nombre: "Hermione Granger",
    descripcion: "Sos organizada y estable emocionalmente.",
    imagen: "https://upload.wikimedia.org/wikipedia/en/d/d3/Hermione_Granger_poster.jpg"
  },
  {
    conditions: { extraversion: "high", agreeableness: "high" },
    nombre: "Tony Stark",
    descripcion: "Sos sociable y empático, te gusta liderar y conectar.",
    imagen: "https://upload.wikimedia.org/wikipedia/en/e/e0/Iron_Man_bleeding_edge.jpg"
  },
  {
    conditions: { agreeableness: "high", openness: "medium" },
    nombre: "Mahatma Gandhi",
    descripcion: "Sos empático, amable y valorás la armonía.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Mahatma-Gandhi%2C_studio%2C_1931.jpg"
  },
  {
    conditions: { neuroticism: "high", extraversion: "low" },
    nombre: "Woody Allen",
    descripcion: "Sos sensible, introspectivo y emocionalmente profundo.",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Woody_Allen_%282015%29.jpg"
  }
];

router.get("/questions", (_req, res) => {
  setTimeout(() => res.json(questions), 600);
});

router.post("/submit", (req, res) => {
  const answers: Record<string, string> = req.body?.answers ?? {};

  const traits: Traits = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0
  };

  // Sumar puntos básicos (acuerdo = +1, desacuerdo = -1)
  for (const q of questions) {
    const selected = answers[q.id];
    if (!selected) continue;

    const key = selected.slice(-1); // a, b, c, d, e
    let incr = 0;
    if (key === "a") incr = 2;
    else if (key === "b") incr = 1;
    else if (key === "d") incr = -1;
    else if (key === "e") incr = -2;

    const trait = q.options.find(opt => opt.id === selected)?.trait;
    if (trait) traits[trait] += incr;
  }

  // Categorizar cada rasgo
  const categories = Object.fromEntries(
    Object.entries(traits).map(([trait, score]) => [trait, categorize(score)])
  );

  // Buscar perfil compuesto que coincida
  const perfil = compositeProfiles.find(p =>
    Object.entries(p.conditions).every(([trait, expected]) => categories[trait] === expected)
  );

  // Siempre devolver summary para que ResultCard no rompa
  const summary = Object.entries(traits).map(([trait, score]) => ({
    trait,
    score,
    description: `Nivel de ${trait}: ${categories[trait]}`
  }));

  if (!perfil) {
    return res.json({
      traits,
      categories,
      summary,
      personality: {
        trait: "none",
        nombre: "Sin coincidencia",
        descripcion: "Tu combinación de rasgos no coincide con un perfil definido.",
        imagen: ""
      }
    });
  }

  res.json({
    traits,
    categories,
    summary,
    personality: {
      trait: "composite",
      nombre: perfil.nombre,
      descripcion: perfil.descripcion,
      imagen: perfil.imagen
    }
  });
});

export default router;
