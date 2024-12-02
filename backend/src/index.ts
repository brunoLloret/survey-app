
import express, { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

// Types
interface SurveyParams extends ParamsDictionary {
	id: string;
}

interface QuestionParams extends ParamsDictionary {
	id: string;
}

// New interface for section params
interface SectionParams extends ParamsDictionary {
	id: string;
}

type AsyncRequestHandler<P = ParamsDictionary> = (
	req: Request<P>,
	res: Response,
	next: NextFunction
) => Promise<any>;

const asyncHandler = <P = ParamsDictionary>(fn: AsyncRequestHandler<P>) => (
	req: Request<P>,
	res: Response,
	next: NextFunction
) => {
	return Promise.resolve(fn(req, res, next)).catch(next);
};

interface Answer {
	questionId: string;
	textValue?: string;
	booleanValue?: boolean;
	selectedOptionIds?: string[];
}

interface Option {
	id?: string;
	label: string;
	value?: string;
}

interface Question {
	id?: string;
	label: string;
	type: string;
	required: boolean;
	orderIndex: number;
	options?: Option[];
}

interface Section {
	id?: string;
	title: string;
	orderIndex: number;
	questions?: Question[];
}

// Middleware
app.use(express.json());
app.use(cors());

// Basic routes
app.get('/', (_: Request, res: Response) => {
	res.json({ message: 'Survey API is running' });
});

// Survey routes
app.get('/surveys', asyncHandler(async (_: Request, res: Response) => {
	const surveys = await prisma.survey.findMany({
		include: {
			sections: {
				include: {
					questions: {
						include: {
							options: true
						}
					}
				}
			}
		}
	});
	res.json(surveys);
}));

// Get survey by ID
app.get('/surveys/:id', asyncHandler<SurveyParams>(async (req, res) => {
	const survey = await prisma.survey.findUnique({
		where: { id: req.params.id },
		include: {
			sections: {
				include: {
					questions: {
						include: {
							options: true
						}
					}
				}
			}
		}
	});

	if (!survey) {
		return res.status(404).json({ error: 'Survey not found' });
	}

	res.json(survey);
}));



// Create new survey
app.post('/surveys', asyncHandler(async (req, res) => {

	// de-structure the parts that the body requested to the client needs to meet
	const { title, description, sections } = req.body;

	// creation of the new survey in the database through prisma
	// the title and description's information will be inputs from req.body (client),
	// the status, on the other hand, is default 'draft' until completed by client
	const newSurvey = await prisma.survey.create({
		data: {
			title,
			description,
			status: 'draft',
			// we map over sections with the create method
			// sections is nested, inside survey, so we need to use
			// the specific notation for the map
			sections: {
				create: sections.map((section: any, index: number) => ({
					title: section.title,
					orderIndex: index,
					questions: {
						create: section.questions.map((question: any, qIndex: number) => ({
							label: question.label,
							required: question.required,
							type: question.type,
							orderIndex: qIndex,
							// here, question is deployed without taking in consideration
							// that is an array
							// Question 1: why there is no method + .map with Question, being that it is so
							//with both section and option?

							// Comment:
							// Strictly speaking, Question is basically a string with a lot of data
							// that depends on its parent (Section), metadata, and the Options in a lower level.
							// In this sense, since Options have a bigger complexity due to its nature,
							// in Options there is the need for a map because of this multiplicity,
							//while in Question there is no need for a map since Section maps down.

							question: question.question,
							placeholder: question.placeholder,
							maxLength: question.maxLength,
							checked: question.checked,

							// options performs map with create
							options: question.options ? {
								create: question.options.map((option: any) => ({
									label: option.label,
									value: option.value || option.label
								}))
							} : undefined
						}))
					}
				}))
			}
		},
		// include defines what to return to the client. In this case, the client will see:
		// sections, questions, options

		// Question 2: What is the difference with select?
		// Include encompasses everything, select is selective
		include: {
			sections: {
				include: {
					questions: {
						include: {
							options: true
						}
					}
				}
			}
		}
	});

	res.json(newSurvey);
}));

// Route to add a new section to an existing survey
app.post('/surveys/:id/sections', asyncHandler(async (req, res) => {
	// Create new section with Prisma
	// This is an atomic operation - either everything succeeds or nothing does
	const newSection = await prisma.section.create({
		data: {
			// Spread operator takes all properties sent from frontend
			// This could include title, description, order, etc.
			...req.body,

			// Establish relationship between new section and existing survey
			// This is handled by the backend, not the frontend
			survey: {
				// 'connect' tells Prisma to link this section to an existing survey
				// The survey ID comes from the URL parameters (:id)
				connect: {
					id: req.params.id
				}
				// Although we do not see it here, by the prisma schema we can deduce:
				// 1) Section will have an id and an orderIndex
				// Question 1:
				// Is this just the creation of a relation, or of also data from the client?

				// Answer 1
				// This creates both the relation AND saves any section data from the client included
				// in req.body (like title, description). The spread operator ...req.body handles the
				// section content.

				// If the second, 2) Where do I see the expression of the content of the section
				//as expected? Or is it not necessary?

				// Answer 2
				// The section content comes from ...req.body which spreads all the client-provided fields.
				// You don't need to explicitly specify them since they match your schema fields.

				// A more general question 3) What operations are run by Prisma that I can see
				// or deduce from the schema and not the express operations?

				// 				From the schema, Prisma automatically handles:
				// UUID generation for IDs
				// Timestamps (createdAt/updatedAt)
				// Cascading deletes (onDelete: Cascade)
				// Foreign key relationships
				// Index creation and maintenance
				// Type validation
				// Required field validation
			}
		}
	});

	// Error handling: if section creation failed
	if (!newSection) {
		return res.status(400).json({ error: 'Failed to create section' });
	}

	// Success: return the newly created section
	// Status 201 indicates successful resource creation
	res.status(201).json(newSection);
}));

//Submit response
app.post('/surveys/:id/responses', asyncHandler(async (req, res) => {
	const newResponse = await prisma.surveyResponse.create({
		data: {
			status: req.body.status || 'partial',
			submittedAt: req.body.status === 'complete' ? new Date() : null,
			survey: {
				connect: {
					id: req.params.id
				}
			},
			answers: {
				create: req.body.answers.map((answer: Answer) => ({
					question: {
						connect: { id: answer.questionId }
					},
					textValue: answer.textValue,
					booleanValue: answer.booleanValue,
					selectedOptions: answer.selectedOptionIds ? {
						connect: answer.selectedOptionIds.map((id: string) => ({ id }))
					} : undefined
				}))
			}
		},
		include: {
			answers: {
				include: {
					selectedOptions: true,
					question: true
				}
			}
		}
	});

	if (!newResponse) {
		return res.status(400).json({ error: 'Failed to create response' });
	}

	res.status(201).json(newResponse);
}));

// //create duplicate
// app.post('/surveys/:id/duplicate', asyncHandler( async(req,res)=> {
// 	const originalSurvey = await prisma.survey.findUnique({
// 		where: {id: req.params.id},
// 		include: {
// 			sections: {
// 				include: {
// 					questions: {
// 						include: {
// 							options: true
// 						}
// 					}
// 				}
// 			}
// 		}
// 	});


//DUPLICATE

app.post('/surveys/:id/duplicate', asyncHandler(async (req, res) => {
	const originalSurvey = await prisma.survey.findUnique({
		where: { id: req.params.id },
		include: {
			sections: {
				include: {
					questions: {
						include: {
							options: true
						}
					}
				}
			}
		}
	});

	if (!originalSurvey) {
		return res.status(404).json({ error: 'Survey not found' });
	}

	const duplicate = await prisma.survey.create({
		data: {
			title: `${originalSurvey.title} (Copy)`,
			description: originalSurvey.description,
			status: 'draft',
			sections: {
				create: originalSurvey.sections.map(section => ({
					title: section.title,
					orderIndex: section.orderIndex,
					questions: {
						create: section.questions.map(question => ({
							label: question.label,
							required: question.required,
							type: question.type,
							orderIndex: question.orderIndex,
							question: question.question,
							placeholder: question.placeholder,
							maxLength: question.maxLength,
							checked: question.checked,
							options: question.options.length > 0 ? {
								create: question.options.map(option => ({
									label: option.label,
									value: option.value
								}))
							} : undefined
						}))
					}
				}))
			}
		},
		include: {
			sections: {
				include: {
					questions: {
						include: {
							options: true
						}
					}
				}
			}
		}
	});

	res.status(201).json(duplicate);
}));

//get all sections
app.get('/surveys/:id/sections', asyncHandler(async (req, res) => {
	const surveysSections = await prisma.survey.findUnique({
		where: { id: req.params.id },
		select: {
			sections: {
				include: {
					questions: true
				}
			}
		}
	});

	if (!surveysSections) {
		return res.status(404).json({ error: 'Survey not found' });
	}

	res.json(surveysSections)
}))


// For updating, we will write a general update endpoint, and particular ones

//update survey details on a basic level
app.patch('/surveys/:id', asyncHandler(async (req, res) => {
	const updatedSurvey = await prisma.survey.update({
		where: { id: req.params.id },
		data: {
			...req.body
		}
	});

	if (!updatedSurvey) {
		return res.status(404).json({ error: 'Survey not found' })
	}

	res.json(updatedSurvey)
}))


// Open, comprehensive, update endpoint

app.patch('/surveys/:id', asyncHandler(async (req, res) => {
	const updatedSurvey = await prisma.survey.update({
		where: { id: req.params.id },
		data: {
			...req.body,
			sections: {
				upsert: req.body.sections?.map((section: Section) => ({
					where: { id: section.id || 'new' },
					create: {
						title: section.title,
						orderIndex: section.orderIndex,
						questions: {
							create: section.questions?.map((question: Question) => ({
								label: question.label,
								type: question.type,
								required: question.required,
								orderIndex: question.orderIndex,
								options: {
									create: question.options?.map((option: Option) => ({
										label: option.label,
										value: option.value
									}))
								}
							}))
						}
					},
					update: {
						title: section.title,
						orderIndex: section.orderIndex,
						questions: {
							upsert: section.questions?.map((question: Question) => ({
								where: { id: question.id || 'new' },
								create: {
									label: question.label,
									type: question.type,
									required: question.required,
									orderIndex: question.orderIndex,
									options: {
										create: question.options?.map((option: Option) => ({
											label: option.label,
											value: option.value
										}))
									}
								},
								update: {
									label: question.label,
									type: question.type,
									required: question.required,
									orderIndex: question.orderIndex,
									options: {
										upsert: question.options?.map((option: Option) => ({
											where: { id: option.id || 'new' },
											create: {
												label: option.label,
												value: option.value
											},
											update: {
												label: option.label,
												value: option.value
											}
										}))
									}
								}
							}))
						}
					}
				}))
			}
		},
		include: {
			sections: {
				include: {
					questions: {
						include: {
							options: true
						}
					}
				}
			}
		}
	});

	if (!updatedSurvey) {
		return res.status(404).json({ error: 'Survey not found' });
	}

	res.json(updatedSurvey);
}));



// Example of getting specific fields (answering question 11)
app.get('/surveys/:id/title', asyncHandler<SurveyParams>(async (req, res) => {
	const survey = await prisma.survey.findUnique({
		where: { id: req.params.id },
		select: {
			title: true,
			description: true
		}
	});

	if (!survey) {
		return res.status(404).json({ error: 'Survey not found' });
	}

	res.json(survey);
}));


// Get questions from a specific section
app.get('/surveys/:surveyId/sections/:sectionId/questions',
	asyncHandler(async (req, res) => {
		const questions = await prisma.question.findMany({
			where: {
				section: {
					id: req.params.sectionId,
					surveyId: req.params.surveyId
				}
			},
			include: {
				options: true
			}
		});

		if (!questions.length) {
			return res.status(404).json({ error: 'No questions found' });
		}

		res.json(questions);
	})
);


// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Something broke!' });
});

// Start server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
	await prisma.$disconnect();
	process.exit(0);
});

export default app;



// DRAFT OPERATIONS
app.get('/surveys/drafts', asyncHandler(async (req, res) => {
	const drafts = await prisma.survey.findMany({
		where: { status: 'draft' },
		include: { sections: true }
	});
	res.json(drafts);
}));

app.delete('/surveys/drafts/:id', asyncHandler(async (req, res) => {
	await prisma.survey.delete({
		where: { id: req.params.id, status: 'draft' }
	});
	res.status(204).send();
}));

// SECTION OPERATIONS
app.get('/surveys/:surveyId/sections/:sectionId', asyncHandler(async (req, res) => {
	const section = await prisma.section.findFirst({
		where: {
			id: req.params.sectionId,
			surveyId: req.params.surveyId
		},
		include: {
			questions: {
				include: { options: true }
			}
		}
	});

	if (!section) {
		return res.status(404).json({ error: 'Section not found' });
	}
	res.json(section);
}));

app.patch('/surveys/:surveyId/sections/:sectionId', asyncHandler(async (req, res) => {
	const section = await prisma.section.update({
		where: {
			id: req.params.sectionId,
			surveyId: req.params.surveyId
		},
		data: {
			...req.body,
			questions: req.body.questions ? {
				upsert: req.body.questions.map((q: Question) => ({
					where: { id: q.id || 'new' },
					create: {
						label: q.label,
						type: q.type,
						required: q.required,
						orderIndex: q.orderIndex,
						options: q.options ? {
							create: q.options.map((opt: Option) => ({
								label: opt.label,
								value: opt.value
							}))
						} : undefined
					},
					update: {
						label: q.label,
						type: q.type,
						required: q.required,
						orderIndex: q.orderIndex
					}
				}))
			} : undefined
		},
		include: {
			questions: {
				include: { options: true }
			}
		}
	});
	res.json(section);
}));

app.delete('/surveys/:surveyId/sections/:sectionId', asyncHandler(async (req, res) => {
	await prisma.section.delete({
		where: {
			id: req.params.sectionId,
			surveyId: req.params.surveyId
		}
	});
	res.status(204).send();
}));

// OPTION OPERATIONS
app.post('/questions/:id/options', asyncHandler(async (req, res) => {
	const newOption = await prisma.option.create({
		data: {
			label: req.body.label,
			value: req.body.value,
			question: {
				connect: { id: req.params.id }
			}
		}
	});
	res.status(201).json(newOption);
}));

app.patch('/options/:id', asyncHandler(async (req, res) => {
	const option = await prisma.option.update({
		where: { id: req.params.id },
		data: req.body
	});
	res.json(option);
}));

app.delete('/options/:id', asyncHandler(async (req, res) => {
	await prisma.option.delete({
		where: { id: req.params.id }
	});
	res.status(204).send();
}));

// PUBLISH/UNPUBLISH OPERATIONS
app.patch('/surveys/:id/publish', asyncHandler(async (req, res) => {
	const survey = await prisma.survey.update({
		where: { id: req.params.id },
		data: { status: 'published' }
	});
	res.json(survey);
}));

app.patch('/surveys/:id/unpublish', asyncHandler(async (req, res) => {
	const survey = await prisma.survey.update({
		where: { id: req.params.id },
		data: { status: 'draft' }
	});
	res.json(survey);
}));

// STATISTICS OPERATIONS
app.get('/surveys/:id/statistics', asyncHandler(async (req, res) => {
	const stats = await prisma.surveyResponse.groupBy({
		by: ['status'],
		where: { surveyId: req.params.id },
		_count: true
	});
	res.json(stats);
}));

app.get('/surveys/:surveyId/sections/:sectionId/statistics', asyncHandler(async (req, res) => {
	const stats = await prisma.questionResponse.groupBy({
		by: ['questionId'],
		where: {
			question: {
				sectionId: req.params.sectionId
			}
		},
		_count: true
	});
	res.json(stats);
}));