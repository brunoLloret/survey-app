import { create } from 'zustand';

import {
    BaseQuestion,
    QuestionType,
    Checkbox,
    RadioButton,
    RadioOption,
    Dropdown,
    DropdownOption,
    MatrixQuestion,
    MatrixOption,
    OpenQuestion,
    Survey,
    SurveyResponse,
    QuestionResponse
} from '../../../shared/shared'


// const useStore = create((set) => ({
//     Surveys<Survey[]>() = [];

//     Survey<Survey>(): { id: ""; title: ""; questions: []; isPublished: false };

//     BaseQuestion<BaseQuestion>(): { id: ""; label: ""; required: true; type: QuestionType }

//     SurveyResponse<SurveyResponse>(): { id: ""; surveyId: ""; respondentId?: ""; submittedAt: null }

//     QuestionResponse<QuestionResponse>(): { questionId: ""; value: null }

//     // initial state

//     getAllSurveys()

//     createSurvey()

//     deleteSurvey()

//     editSurvey()

//     AddTitle()

//     deleteTitle()

//     editTitle()

//     AddQuestion()
    
//     deleteQuestion()

//     editQuestion()

//     publishSurvey()


//     // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),

//     // removeAllBears: () => set({ bears: 0 }),

//     // updateBears: (newBears) => set({ bears: newBears }),




// }))
