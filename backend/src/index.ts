
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
	const { title, description, sections } = req.body;

	const newSurvey = await prisma.survey.create({
		data: {
			title,
			description,
			status: 'draft',
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
							question: question.question,
							placeholder: question.placeholder,
							maxLength: question.maxLength,
							checked: question.checked,
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
