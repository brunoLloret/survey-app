import axios from "axios"

const surveyAPI = () => {
  const baseUrl = 'http://localhost:3001/surveys'

  // Could add shared error handling
  const handleError = (error, method) => {
    console.error(`Error in ${method}:`, error)
    throw error  // or return a custom error object
  }

  return {

    getAllSurveys: async () => {
      try {
        const response = await axios.get(baseUrl)
        return response.data
      } catch (error) {
        return handleError(error, 'getAllSurveys')
      }
    },

    getSurveyById: async (id) => {
      try {
        const response = await axios.get(`${baseUrl}/${id}`)
        return response.data
      } catch (error) {
        return handleError(error, 'getSurveyById')
      }
    }
  }
}

export default surveyAPI