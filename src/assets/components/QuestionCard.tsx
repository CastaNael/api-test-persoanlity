import type { Question } from "../../types/question";

type Props = {
  question: Question;
  selected: string | undefined;
  onSelect: (optionId: string) => void;
};

export default function QuestionCard({ question, selected, onSelect }: Props) {
  return (
    <fieldset className="question-card">
      <legend className="question-text">{question.text}</legend>
      <div className="options">
        {question.options.map((opt) => (
          <label key={opt.id} className={`option ${selected === opt.id ? "selected" : ""}`}>
            <input
              type="radio"
              name={question.id}
              value={opt.id}
              checked={selected === opt.id}
              onChange={() => onSelect(opt.id)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
