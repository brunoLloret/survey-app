interface SeedOption {
    id: string | number;
    label: string;
    value?: string;
}

interface BaseSeedQuestion {
    id: string;
    type: 'checkbox' | 'radio' | 'dropdown' | 'open' | 'matrix';
    label: string;
    required: boolean;
}

interface OpenSeedQuestion extends BaseSeedQuestion {
    type: 'open';
    question: string;
    answer: string | null;
    placeholder?: string;
    maxLength?: number;
}

interface CheckboxSeedQuestion extends BaseSeedQuestion {
    type: 'checkbox';
    checked: boolean;
}

interface OptionBasedQuestion extends BaseSeedQuestion {
    options: SeedOption[];
    selectedOptionId: string | null;
}

interface RadioSeedQuestion extends OptionBasedQuestion {
    type: 'radio';
}

interface DropdownSeedQuestion extends OptionBasedQuestion {
    type: 'dropdown';
}

interface MatrixSeedQuestion extends OptionBasedQuestion {
    type: 'matrix';
}

type SeedQuestion = OpenSeedQuestion | CheckboxSeedQuestion | RadioSeedQuestion | DropdownSeedQuestion | MatrixSeedQuestion;

interface SeedSection {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    questions: SeedQuestion[];
}

interface SeedSurvey {
    id: string;
    title: string;
    description: string;
    status: 'published' | 'draft' | 'closed';
    createdAt: Date;
    updatedAt: Date;
    sections: SeedSection[];
}

interface SeedAnswer {
    questionId: string;
    value: string | boolean | null;
}

interface SeedResponse {
    id: string;
    surveyId: string;
    submittedAt: Date;
    answers: SeedAnswer[];
}

interface SeedData {
    surveys: SeedSurvey[];
    responses: SeedResponse[];
}

export type {
    SeedData,
    SeedSurvey,
    SeedSection,
    SeedQuestion,
    SeedAnswer,
    SeedResponse,
    SeedOption,
    OpenSeedQuestion,
    CheckboxSeedQuestion,
    RadioSeedQuestion,
    DropdownSeedQuestion,
    MatrixSeedQuestion
};

// interface SeedOption {
//     id: string | number;
//     label: string;
//     value?: string;
// }

// interface BaseSeedQuestion {
//     id: string;
//     type: 'checkbox' | 'radio' | 'dropdown' | 'open' | 'matrix';
//     label: string;
//     required: boolean;
//     orderIndex?: number;
// }

// interface OpenSeedQuestion extends BaseSeedQuestion {
//     type: 'open';
//     question: string;
//     answer: string | null;
//     placeholder?: string;
//     maxLength?: number;
// }

// interface CheckboxSeedQuestion extends BaseSeedQuestion {
//     type: 'checkbox';
//     checked: boolean;
// }

// interface OptionBasedQuestion extends BaseSeedQuestion {
//     options: SeedOption[];
//     selectedOptionId: string | null;
// }

// interface RadioSeedQuestion extends OptionBasedQuestion {
//     type: 'radio';
// }

// interface DropdownSeedQuestion extends OptionBasedQuestion {
//     type: 'dropdown';
// }

// interface MatrixSeedQuestion extends OptionBasedQuestion {
//     type: 'matrix';
// }

// type SeedQuestion = OpenSeedQuestion | CheckboxSeedQuestion | RadioSeedQuestion | DropdownSeedQuestion | MatrixSeedQuestion;

// interface SeedSurvey {
//     id: string;
//     title: string;
//     status: 'published' | 'draft' | 'closed';  // Changed to lowercase to match Prisma enum
//     updatedAt: Date;
//     questions: SeedQuestion[];
// }

// interface SeedAnswer {
//     questionId: string;
//     value: string | boolean | null;
// }

// interface SeedResponse {
//     id: string;
//     surveyId: string;
//     submittedAt: Date;
//     answers: SeedAnswer[];
// }

// interface SeedData {
//     surveys: SeedSurvey[];
//     responses: SeedResponse[];
// }

// export type { SeedData };