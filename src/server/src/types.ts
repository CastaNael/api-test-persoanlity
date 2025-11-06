// types.ts

export type Question = {
  id: string;
  text: string;
  options: { id: string; label: string; trait: keyof Traits }[];
};

export type Traits = {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
};

export type TestResult = {
  traits: Traits;
  summary: keyof Traits; // el rasgo dominante
  percentages?: Record<keyof Traits, number>; // opcional: perfil en %
};
