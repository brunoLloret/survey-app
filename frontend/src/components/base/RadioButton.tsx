import { useState, useEffect } from "react";

interface BaseQuestion {
  id: string;
  label: string;
  required: boolean;
  type: QuestionType;
}

type QuestionType = "checkbox" | "radio" | "dropdown" | "open" | "matrix";

interface RadioButton extends BaseQuestion {
  type: "radio";
  options: RadioOption[];
  selectedOptionId: string | null;
}

interface RadioOption {
  id: string;
  label: string;
}

const Radio = ({
  label,
  options,
  selectedOptionId,
  onChange,
}: {
  label: string;
  options: RadioOption[];
  selectedOptionId: string | null;
  onChange: (id: string) => void;
}) => {
  return (
    <>
      {options.map((option) => (
        <div key={option.id}>
          <label>
            <input
              type="radio"
              value={option.id}
              checked={option.id === selectedOptionId}
              onChange={(e) => onChange(e.target.value)}
            />
            <span>{option.label}</span>
          </label>
        </div>
      ))}
    </>
  );
};
export default Radio;
