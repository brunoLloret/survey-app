import { PrismaClient, SurveyStatus, QuestionType } from '@prisma/client';
const prisma = new PrismaClient();
import surveySeeds from '../src/seeds/surveySeeds';

async function main() {
    try {
        console.log('Starting seeding...');

        // Create surveys with sections and questions
        for (const surveyData of surveySeeds.surveys) {
            console.log(`Creating survey: ${surveyData.title}`);

            const survey = await prisma.survey.create({
                data: {
                    id: surveyData.id,
                    title: surveyData.title,
                    description: surveyData.description,
                    status: surveyData.status.toLowerCase() as SurveyStatus,
                    createdAt: surveyData.createdAt,
                    updatedAt: surveyData.updatedAt,
                },
            });

            // Create sections for each survey
            for (const [sectionIndex, sectionData] of surveyData.sections.entries()) {
                console.log(`Creating section: ${sectionData.title}`);

                const section = await prisma.section.create({
                    data: {
                        id: sectionData.id,
                        title: sectionData.title,
                        orderIndex: sectionIndex,
                        surveyId: survey.id,
                        createdAt: sectionData.createdAt,
                        updatedAt: sectionData.updatedAt,
                    },
                });

                // Create questions for each section
                for (const [questionIndex, questionData] of sectionData.questions.entries()) {
                    console.log(`Creating question: ${questionData.label}`);

                    const questionCreate = await prisma.question.create({
                        data: {
                            id: questionData.id,
                            sectionId: section.id,  // Now connecting to section instead of survey
                            label: questionData.label,
                            required: questionData.required,
                            type: questionData.type.toLowerCase() as QuestionType,
                            orderIndex: questionIndex,
                            question: 'question' in questionData ? questionData.question : undefined,
                            placeholder: 'placeholder' in questionData ? questionData.placeholder : undefined,
                            maxLength: 'maxLength' in questionData ? questionData.maxLength : undefined,
                            checked: 'checked' in questionData ? questionData.checked : undefined,
                        },
                    });

                    // Create options for questions that have them
                    if ('options' in questionData && questionData.options) {
                        for (const optionData of questionData.options) {
                            await prisma.option.create({
                                data: {
                                    id: optionData.id.toString(),
                                    questionId: questionCreate.id,
                                    label: optionData.label,
                                    value: 'value' in optionData ? optionData.value : optionData.label,
                                },
                            });
                        }
                    }
                }
            }
        }

        // Create responses after all surveys, sections, and questions exist
        for (const responseData of surveySeeds.responses) {
            console.log(`Creating response for survey: ${responseData.surveyId}`);

            const response = await prisma.surveyResponse.create({
                data: {
                    id: responseData.id,
                    surveyId: responseData.surveyId,
                    status: 'complete',
                    submittedAt: responseData.submittedAt,
                },
            });

            for (const answerData of responseData.answers) {
                const question = await prisma.question.findUnique({
                    where: { id: answerData.questionId },
                    include: { section: true }, // Include section data for validation if needed
                });

                if (!question) {
                    console.log(`Question ${answerData.questionId} not found, skipping response`);
                    continue;
                }

                try {
                    switch (question.type) {
                        case 'open':
                            await prisma.questionResponse.create({
                                data: {
                                    surveyResponseId: response.id,
                                    questionId: answerData.questionId,
                                    textValue: answerData.value as string,
                                },
                            });
                            break;

                        case 'checkbox':
                            await prisma.questionResponse.create({
                                data: {
                                    surveyResponseId: response.id,
                                    questionId: answerData.questionId,
                                    booleanValue: answerData.value as boolean,
                                },
                            });
                            break;

                        case 'radio':
                        case 'dropdown':
                        case 'matrix':
                            await prisma.questionResponse.create({
                                data: {
                                    surveyResponseId: response.id,
                                    questionId: answerData.questionId,
                                    selectedOptions: {
                                        connect: [{ id: answerData.value as string }],
                                    },
                                },
                            });
                            break;
                    }
                } catch (error) {
                    console.error(`Error creating response for question ${answerData.questionId}:`, error);
                }
            }
        }

        console.log('Seeding completed.');
    } catch (error) {
        console.error('Error during seeding:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// import { PrismaClient, SurveyStatus, QuestionType } from '@prisma/client';
// const prisma = new PrismaClient();
// import surveySeeds from './seeds/surveySeeds';

// async function main() {
//     try {
//         console.log('Starting seeding...');

//         // Create surveys and their questions first
//         for (const surveyData of surveySeeds.surveys) {
//             console.log(`Creating survey: ${surveyData.title}`);

//             const survey = await prisma.survey.create({
//                 data: {
//                     id: surveyData.id,
//                     title: surveyData.title,
//                     status: surveyData.status.toLowerCase() as SurveyStatus,
//                     createdAt: surveyData.updatedAt,
//                     updatedAt: surveyData.updatedAt,
//                 },
//             });

//             for (const [index, questionData] of surveyData.questions.entries()) {
//                 console.log(`Creating question: ${questionData.label}`);

//                 const questionCreate = await prisma.question.create({
//                     data: {
//                         id: questionData.id,
//                         surveyId: survey.id,
//                         label: questionData.label,
//                         required: questionData.required,
//                         type: questionData.type.toLowerCase() as QuestionType,
//                         orderIndex: index,
//                         question: 'question' in questionData ? questionData.question : undefined,
//                         placeholder: 'placeholder' in questionData ? questionData.placeholder : undefined,
//                         maxLength: 'maxLength' in questionData ? questionData.maxLength : undefined,
//                         checked: 'checked' in questionData ? questionData.checked : undefined,
//                     },
//                 });

//                 if ('options' in questionData && questionData.options) {
//                     for (const optionData of questionData.options) {
//                         await prisma.option.create({
//                             data: {
//                                 id: optionData.id.toString(),
//                                 questionId: questionCreate.id,
//                                 label: optionData.label,
//                                 value: 'value' in optionData ? optionData.value : optionData.label,
//                             },
//                         });
//                     }
//                 }
//             }
//         }

//         // Create responses after all surveys and questions exist
//         for (const responseData of surveySeeds.responses) {
//             console.log(`Creating response for survey: ${responseData.surveyId}`);

//             const response = await prisma.surveyResponse.create({
//                 data: {
//                     id: responseData.id,
//                     surveyId: responseData.surveyId,
//                     status: 'complete',
//                     submittedAt: responseData.submittedAt,
//                 },
//             });

//             for (const answerData of responseData.answers) {
//                 const question = await prisma.question.findUnique({
//                     where: { id: answerData.questionId },
//                 });

//                 if (!question) {
//                     console.log(`Question ${answerData.questionId} not found, skipping response`);
//                     continue;
//                 }

//                 try {
//                     switch (question.type) {
//                         case 'open':
//                             await prisma.questionResponse.create({
//                                 data: {
//                                     surveyResponseId: response.id,
//                                     questionId: answerData.questionId,
//                                     textValue: answerData.value as string,
//                                 },
//                             });
//                             break;

//                         case 'checkbox':
//                             await prisma.questionResponse.create({
//                                 data: {
//                                     surveyResponseId: response.id,
//                                     questionId: answerData.questionId,
//                                     booleanValue: answerData.value as boolean,
//                                 },
//                             });
//                             break;

//                         case 'radio':
//                         case 'dropdown':
//                         case 'matrix':
//                             await prisma.questionResponse.create({
//                                 data: {
//                                     surveyResponseId: response.id,
//                                     questionId: answerData.questionId,
//                                     selectedOptions: {
//                                         connect: [{ id: answerData.value as string }],
//                                     },
//                                 },
//                             });
//                             break;
//                     }
//                 } catch (error) {
//                     console.error(`Error creating response for question ${answerData.questionId}:`, error);
//                 }
//             }
//         }

//         console.log('Seeding completed.');
//     } catch (error) {
//         console.error('Error during seeding:', error);
//         throw error;
//     }
// }

// main()
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });