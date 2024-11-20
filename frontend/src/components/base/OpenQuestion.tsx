import { useState, useEffect } from "react";

interface BaseQuestion {
  id: string;
  label: string;
  required: boolean;
  type: QuestionType;
}

type QuestionType = "checkbox" | "radio" | "dropdown" | "open" | "matrix";

interface OpenQuestion extends BaseQuestion {
  type: "open";
  question: string;
  answer: string | null;
  placeholder?: string;
  maxLength?: number;
}

const OpenQuestion = ({
  question,
  answer: initialAnswer,
  placeholder,
  maxLength,
  onSave,
}: {
  question: string;
  answer: string | null;
  placeholder: string;
  maxLength: number;
  onSave?: (answer: string) => void;
}) => {
  const [answer, setAnswer] = useState(initialAnswer || "");

  useEffect(() => {
    setAnswer(initialAnswer || "");
  }, [initialAnswer]);

  const handleChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(answer);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="answer"
          placeholder={placeholder}
          maxLength={maxLength}
          value={answer}
          required
          onChange={handleChange}
        />
        <button type="submit"> save answer </button>
      </form>
      <p>{answer}</p>
    </>
  );
};
export default OpenQuestion;
