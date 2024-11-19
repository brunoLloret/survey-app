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

// Error handler types
type AsyncRequestHandler<P = ParamsDictionary> = (
	req: Request<P>,
	res: Response,
	next: NextFunction
) => Promise<any>;

// Error handler wrapper
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
app.get('/api/surveys', asyncHandler(async (_: Request, res: Response) => {
	const surveys = await prisma.survey.findMany({
		include: {
			questions: {
				include: {
					options: true
				}
			}
		}
	});
	res.json(surveys);
}));

app.get('/api/surveys/:id', asyncHandler<SurveyParams>(async (req, res) => {
	const survey = await prisma.survey.findUnique({
		where: { id: req.params.id },
		include: {
			questions: {
				include: {
					options: true
				}
			}
		}
	});

	if (!survey) {
		return res.status(404).json({ error: 'Survey not found' });
	}

	res.json(survey);
}));

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