import type { TestResult } from "../../types/result";

type Props = {
  result: TestResult;
  onReset: () => void;
};

export default function ResultCard({ result, onReset }: Props) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h2>Resultado del Test</h2>

      <h3>Resumen</h3>
      <ul>
        {result.summary.map((item) => (
          <li key={item.trait}>
            <strong>{item.trait}:</strong> {item.score} <br />
            <em>{item.description}</em>
          </li>
        ))}
      </ul>

      <h3>Detalle de rasgos</h3>
      <ul>
        {Object.entries(result.traits).map(([trait, value]) => (
          <li key={trait}>
            <strong>{trait}:</strong> {value}
          </li>
        ))}
      </ul>

      <button onClick={onReset} style={{ marginTop: "1rem" }}>
        Reiniciar test
      </button>
    </div>
  );
}
