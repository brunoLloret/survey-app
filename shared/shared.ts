
export interface BaseQuestion {
    id: string;
    label: string;
    required: boolean;
    type: QuestionType;
    orderIndex: number;
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
    label: string;
    options: DropdownOption[];
    selectedOptionId: string | null;
}

export interface DropdownOption {
    id: string;
    label: string;
    value: string;
}

export interface MatrixQuestion {
    id: number;
    label: string;
    type: 'matrix';
    options: MatrixOption[] | MatrixQuestion;
    selectedOptionId: number | null;
    orderIndex: number;
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


export interface Section {
    id: string;
    title: string;
    questions: (OpenQuestion | Checkbox | RadioButton | Dropdown | MatrixQuestion)[];
    status: SectionStatus;
    createdAt: Date;
    updatedAt: Date;
}

export enum SectionStatus {
    DRAFT = 'draft',
    SUBMITTED = 'submitted',
}

//Response types

export interface SectionResponse {
    id: string;
    sectionId: string;
    status: SectionResponseStatus;
    respondentId?: string;
    submittedAt: Date | null;
    answers: QuestionResponse[];
}
export enum SectionResponseStatus {
    COMPLETE = 'complete',
    PARTIAL = 'partial',
    INVALID = 'invalid'
}
export type QuestionResponse = {
    questionId: string;
    value: string | boolean | string[] | null;
}


export interface Survey {
    id: string;
    title: string;
    description: string;
    sections: Section[];
    status: SurveyStatus;
    createdAt: Date;
    updatedAt: Date;
}

export enum SurveyStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    CLOSED = 'closed',
}


// also, could be >> export { Checkbox, RadioButton, Dropdown, Survey, Matrix }

// // validations and error handling

// interface SurveyValidation {
//     hasTitle: boolean
//     hasQuestions: boolean
//     isComplete: boolean              // All required fields filled
//     canBePublished: boolean         // Meets minimum requirements
// }

// interface QuestionValidation {
//     hasLabel: boolean
//     hasOptions?: boolean            // For radio/dropdown/matrix
//     hasMinimumOptions?: boolean     // e.g., at least 2 options for multiple choice
//     isAnswerValid?: boolean         // For open questions: meets length requirements
//     meetsRequirements: boolean      // Question-specific validation
// }

// type ErrorType = 
//     | 'SURVEY_NOT_FOUND'
//     | 'SURVEY_CREATION_FAILED'
//     | 'QUESTION_UPDATE_FAILED'
//     | 'RESPONSE_SUBMISSION_FAILED'
//     | 'VALIDATION_ERROR'
//     | 'NETWORK_ERROR'
//     | 'DATABASE_ERROR'

// interface OperationError {
//     type: ErrorType
//     message: string
//     field?: string                  // Specific field causing error
//     timestamp: Date
//     recoverable: boolean            // Can the operation be retried?
// }

// interface FormError {
//     fieldName: string
//     errorType: 'required' | 'format' | 'length' | 'invalid'
//     message: string
// }

// //loading

// interface LoadingState {
//     isLoading: boolean
//     operation: 
//         | 'FETCHING_SURVEYS'
//         | 'CREATING_SURVEY'
//         | 'UPDATING_SURVEY'
//         | 'SUBMITTING_RESPONSE'
//         | 'FETCHING_STATISTICS'
//     progress?: number               // For multi-step operations
//     startTime?: Date               // For tracking long operations
// }

// interface ComponentLoadingState {
//     surveysLoading: boolean
//     questionsLoading: boolean
//     responsesLoading: boolean
//     statisticsLoading: boolean
// }

//future pagination

// interface SurveyPagination {
//     page: number
//     limit: number              // Surveys per page
//     totalSurveys: number
//     totalPages: number
//     hasNextPage: boolean
//     hasPreviousPage: boolean
// }

// interface QuestionPagination {
//     currentPage: number
//     questionsPerPage: number
//     totalQuestions: number
//     totalPages: number
//     currentQuestions: (OpenQuestion | Checkbox | RadioButton | Dropdown | MatrixQuestion)[]
//     isLastPage: boolean
//     isFirstPage: boolean
// }

// interface ResponsePagination {
//     page: number
//     limit: number              // Responses per page
//     totalResponses: number
//     totalPages: number
//     hasMore: boolean
// }