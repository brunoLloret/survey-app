import { create } from 'zustand';
import surveyAPI  from '../lib/services/users/service'
import { Survey } from '../../../shared/shared'
// import {
//     BaseQuestion,
//     QuestionType,
//     Checkbox,
//     RadioButton,
//     RadioOption,
//     Dropdown,
//     DropdownOption,
//     MatrixQuestion,
//     MatrixOption,
//     OpenQuestion,
    
//     SurveyResponse,
//     QuestionResponse
// } from '../../../shared/shared'



export interface StoreState {
  surveys: Survey[];
  isLoading: boolean;
  error: string | null;
  fetchSurveys: () => Promise<void>;
  setSelectedRadioOption: (questionId: string, optionId: string) => void;
}


export const useStore = create<StoreState>()((set) => ({
  surveys: [] as Survey[],
  isLoading: false,
  error: null,

  fetchSurveys: async () => {
    set({ isLoading: true });
    try {
      const data = await surveyAPI().getAllSurveys();
      set({ surveys: data, isLoading: false });
    } catch (error) {
      set({ error: error as string, isLoading: false });
    }
  },

  setSelectedRadioOption: (questionId: string, optionId: string) =>
    set((state) => ({
      surveys: state.surveys.map(survey => ({
        ...survey,
        questions: survey.questions.map(question =>
          question.id === questionId
          ? {...question, selectedOption: optionId} : question
        )
      }))
    }))
}));
  

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
