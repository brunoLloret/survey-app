import { useState } from "react";
import { ChevronDown } from "lucide-react";
interface BaseQuestion {
  id: string;
  label: string;
  required: boolean;
  type: QuestionType;
}

type QuestionType = "checkbox" | "radio" | "dropdown" | "open" | "matrix";

interface Dropdown extends BaseQuestion {
  type: "dropdown";
  options: DropdownOption[];
  selectedOptionId: string | null;
}

interface DropdownOption {
  id: string;
  label: string;
  value: string;
}

const Dropdown = ({
  options,
  selectedOptionId,
}: {
  options: DropdownOption[];
  selectedOptionId: string | null;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownOption | null>(
    options.find((opt) => opt.id === selectedOptionId) || null
  );

  const handleSelect = (option: DropdownOption) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Dropdown button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border rounded-lg shadow-sm flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className={selected ? "text-gray-900" : "text-gray-500"}>
          {selected ? selected.label : "Select an option"}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <li key={option.id}>
                <button
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-2 text-left hover:bg-blue-50 ${
                    selected?.id === option.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-900"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
