import React, { useEffect, useState } from "react";
import { getQuestions, submitAnswers } from "./services/api";
import type { Question } from "./types/question";
import type { TestResult } from "./types/result";
import QuestionCard from "./assets/components/QuestionCard";
import ResultCard from "./assets/components/ResultCard";
import Loader from "./assets/components/Loader";
import ErrorMessage from "./assets/components/ErrorMessage";

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getQuestions()
      .then(setQuestions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    try {
      const res = await submitAnswers(answers);
      setResult(res);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setError(null);
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (result) return <ResultCard result={result} onReset={handleReset} />;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Test de Personalidad</h1>
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          question={q}
          selected={answers[q.id]}
          onSelect={(optId) => handleSelect(q.id, optId)}
        />
      ))}
      <button
        onClick={handleSubmit}
        disabled={questions.length !== Object.keys(answers).length}
      >
        Enviar respuestas
      </button>
    </div>
  );
}

export default App;
