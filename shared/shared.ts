


export interface BaseQuestion {
    id: string;
    label: string;
    required: boolean;
    type: QuestionType;
}

export type QuestionType = 'checkbox' | 'radio' | 'dropdown' | 'open' | 'matrix';

export interface Checkbox extends BaseQuestion {
    type: 'checkbox';
    checked: boolean;
    label: string;
}

export interface RadioButton extends BaseQuestion {
    type: 'radio';
    options: RadioOption[];
    selectedOptionId: string | null;
}

export interface RadioOption {
    id: string;
    label: string;
}

export interface Dropdown extends BaseQuestion {
    type: 'dropdown';
    options: DropdownOption[];
    selectedOptionId: string | null;
}

export interface DropdownOption {
    id: string;
    label: string;
    value: string;
}

export interface MatrixQuestion {
    type: 'matrix';
    options: MatrixOption[] | MatrixQuestion;
    selectedOptionId: number | null;
}

export interface MatrixOption {
    id: number;
    label: string;
    value: string | MatrixQuestion | MatrixOption;
}

export interface OpenQuestion extends BaseQuestion {
    type: 'open';
    question: string;
    answer: string | null;
    placeholder?: string;
    maxLength?: number;
}

export interface Survey {
    id: string;
    title: string;
    questions: (OpenQuestion | Checkbox | RadioButton | Dropdown | MatrixQuestion)[];
    isPublished: boolean;
}

//Response types

export interface SurveyResponse {
    id: string;
    surveyId: string;
    respondentId?: string;
    submitteddAt: Date;
    answers: QuestionResponse[];
}

export type QuestionResponse = {
    questionId: string;
    value: string | boolean | string[] | null;
}



// also, could be >> export { Checkbox, RadioButton, Dropdown, Survey, Matrix }