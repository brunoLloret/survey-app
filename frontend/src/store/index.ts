import { create } from 'zustand'
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

const useStore = create((set) => ({
    Survey<Survey>(): { id: ""; title: ""; questions: []; isPublished: false }
    // initial state


    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),

    removeAllBears: () => set({ bears: 0 }),

    updateBears: (newBears) => set({ bears: newBears }),

}))


