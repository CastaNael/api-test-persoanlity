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

const traitDescriptions: Record<string, string> = {
  openness: "Sos creativo, curioso y abierto a nuevas ideas.",
  conscientiousness: "Te destacás por tu organización, disciplina y responsabilidad.",
  extraversion: "Disfrutás de la compañía de otros y sos enérgico en lo social.",
  agreeableness: "Sos empático, amable y valorás la cooperación.",
  neuroticism: "Sos sensible a las emociones y podés preocuparte con facilidad."
};

router.get("/questions", (_req, res) => {
  setTimeout(() => res.json(questions), 600);
});

router.post("/submit", (req, res) => {
  const answers: Record<string, string> = req.body?.answers ?? {};
  const scoreMap: Record<string, number> = { a: 5, b: 4, c: 3, d: 2, e: 1 };

  const traits: Traits = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0
  };

  for (const q of questions) {
    const selected = answers[q.id];
    const key = selected?.slice(-1);
    const incr = key ? scoreMap[key] ?? 3 : 3;

    const trait = q.options.find(opt => opt.id === selected)?.trait;
    if (trait) traits[trait] += incr;
  }

  const sortedTraits = Object.entries(traits).sort((a, b) => b[1] - a[1]);

  res.json({
    traits,
    summary: sortedTraits.map(([trait, score]) => ({
      trait,
      score,
      description: traitDescriptions[trait]
    }))
  });
});

export default router;
