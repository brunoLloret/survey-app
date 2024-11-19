import type { SeedData } from '../types';

const surveySeeds: SeedData = {
    surveys: [
        {
            id: "survey-1",
            title: "Customer Satisfaction Survey",
            status: "published",  // Changed from PUBLISHED
            updatedAt: new Date("2024-11-15"),
            questions: [
                {
                    id: "q1-s1",
                    type: "open",
                    label: "How did you hear about our product?",
                    required: true,
                    question: "Please tell us how you discovered us",
                    answer: null,
                    placeholder: "Type your answer here",
                    maxLength: 500
                },
                {
                    id: "q2-s1",
                    type: "radio",
                    label: "How satisfied are you with our service?",
                    required: true,
                    options: [
                        { id: "opt1-q2-s1", label: "Very Satisfied" },
                        { id: "opt2-q2-s1", label: "Satisfied" },
                        { id: "opt3-q2-s1", label: "Neutral" },
                        { id: "opt4-q2-s1", label: "Dissatisfied" },
                        { id: "opt5-q2-s1", label: "Very Dissatisfied" }
                    ],
                    selectedOptionId: null
                },
                {
                    id: "q3-s1",
                    type: "checkbox",
                    label: "Would you recommend us to others?",
                    required: false,
                    checked: false
                }
            ]
        },
        {
            id: "survey-2",
            title: "Product Feature Feedback",
            status: "draft",      // Changed from DRAFT
            updatedAt: new Date("2024-11-17"),
            questions: [
                {
                    id: "q1-s2",
                    type: "dropdown",
                    label: "Which feature do you use most?",
                    required: true,
                    options: [
                        { id: "opt1-q1-s2", label: "Dashboard", value: "dashboard" },
                        { id: "opt2-q1-s2", label: "Reports", value: "reports" },
                        { id: "opt3-q1-s2", label: "Analytics", value: "analytics" },
                        { id: "opt4-q1-s2", label: "Settings", value: "settings" }
                    ],
                    selectedOptionId: null
                },
                {
                    id: "q2-s2",
                    type: "matrix",
                    label: "Rate these features",
                    required: true,
                    options: [
                        {
                            id: 1,
                            label: "Ease of Use",
                            value: "ease",
                        },
                        {
                            id: 2,
                            label: "Speed",
                            value: "speed"
                        },
                        {
                            id: 3,
                            label: "Reliability",
                            value: "reliability"
                        }
                    ],
                    selectedOptionId: null
                }
            ]
        },
        {
            id: "survey-3",
            title: "Website Usability Survey",
            status: "closed",     // Changed from CLOSED
            updatedAt: new Date("2024-11-10"),
            questions: [
                {
                    id: "q1-s3",
                    type: "open",
                    label: "What improvements would you suggest for our website?",
                    required: false,
                    question: "Please share your thoughts on how we can improve",
                    answer: null,
                    placeholder: "Your suggestions here",
                    maxLength: 1000
                }
            ]
        }
    ],
    responses: [
        {
            id: "resp-1",
            surveyId: "survey-1",
            submittedAt: new Date("2024-11-16"),
            answers: [
                {
                    questionId: "q1-s1",
                    value: "Found you through Google search"
                },
                {
                    questionId: "q2-s1",
                    value: "opt1-q2-s1" // Very Satisfied
                },
                {
                    questionId: "q3-s1",
                    value: true
                }
            ]
        },
        {
            id: "resp-2",
            surveyId: "survey-1",
            submittedAt: new Date("2024-11-16"),
            answers: [
                {
                    questionId: "q1-s1",
                    value: "Social media advertisement"
                },
                {
                    questionId: "q2-s1",
                    value: "opt2-q2-s1" // Satisfied
                },
                {
                    questionId: "q3-s1",
                    value: true
                }
            ]
        },
        {
            id: "resp-3",
            surveyId: "survey-3",
            submittedAt: new Date("2024-11-11"),
            answers: [
                {
                    questionId: "q1-s3",
                    value: "The navigation could be more intuitive. Consider adding a search feature."
                }
            ]
        }
    ]
} as const;

export default surveySeeds;