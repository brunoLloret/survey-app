
export namespace FormComponents {

    interface BaseQuestion {
        id: string;
        label: string;
        required: boolean;
        type: QuestionType;
    }

    type QuestionType = 'checkbox' | 'radio' | 'dropdown' | 'open' | 'matrix';

    interface Checkbox extends BaseQuestion {
        type: 'checkbox';
        checked: boolean;
        label: string;
    }

    interface RadioButton extends BaseQuestion {
        type: 'radio';
        options: RadioOption[];
        selectedOptionId: string | null;
    }

    interface RadioOption {
        id: string;
        label: string;
    }


    interface Dropdown extends BaseQuestion {
        type: 'dropdown';
        options: DropdownOption[];
        selectedOptionId: string | null;
    }

    interface DropdownOption {
        id: string;
        label: string;
        value: string;
    }


    interface MatrixQuestion {
        type: 'matrix';
        options: MatrixOption[];
        selectedOptionId: number | null;
    }

    interface MatrixOption {
        id: number;
        label: string;
        value: string;
    }

    interface OpenQuestion extends BaseQuestion {
        type: 'open';
        question: string;
        answer: string | null;
        placeholder?: string;
        maxLength?: number;
    }

    interface Survey {
        id: string;
        title: string;
        questions: (OpenQuestion | Checkbox | RadioButton | Dropdown)[];
        isPublished: boolean;
    }

    //Response types

    interface SurveyResponse {
        id: string;
        surveyId: string;
        respondentId?: string;
        submitteddAt: Date;
        answers: QuestionResponse[];
    }

    type QuestionResponse = {
        questionId: string;
        value: string | boolean | string[] | null;
    }

}

// also, could be >> export { Checkbox, RadioButton, Dropdown, Survey }