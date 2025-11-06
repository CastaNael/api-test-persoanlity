import type { Question } from "../types/question";
import type { TestResult } from "../types/result";

const API_URL = "http://localhost:4000/api/test";

export async function getQuestions(): Promise<Question[]> {
  const res = await fetch(`${API_URL}/questions`);
  if (!res.ok) throw new Error("Error al cargar preguntas");
  return res.json();
}

export async function submitAnswers(answers: Record<string, string>): Promise<TestResult> {
  const res = await fetch(`${API_URL}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers })
  });
  if (!res.ok) throw new Error("Error al enviar respuestas");
  return res.json();
}
