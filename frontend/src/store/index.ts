import {
    Survey,
} from '../../../shared/shared'

interface StoreState {
    surveys: Survey[]
    currentSurvey: Survey | null
    isLoading: boolean
    error: string | null
}

const initialState: StoreState = {
    surveys: [],
    currentSurvey: null,
    isLoading: false,
    error: null
}



