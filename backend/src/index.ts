
// import express and Req, Res,
import express, { Request, Response, NextFunction } from 'express';
// 1) What is NextFunction?
//NextFunction is a middleware function type in Express that passes control
// to the next middleware function. It's commonly used for error handling and request processing.

// 2) What is ParamsDictionary?
//ParamsDictionary is a TypeScript interface for route parameters in Express,
// defining them as a key-value pair of strings.
import { ParamsDictionary } from 'express-serve-static-core';

//3) What is CORS?
// CORS (Cross-Origin Resource Sharing) is a security mechanism
// that allows/restricts web resources to be requested from different domains.
import cors from 'cors';

//Import the Prisma Client, that allows us to interact with the ORM-prisma schema, an intermediate
//layer between the database and the server
import { PrismaClient } from '@prisma/client';

//Import dotenv, file where variables that are used by the codebase but remain in secret or undisclosed
//live
import dotenv from 'dotenv';

// 4) What is dotenv.config? How does it relate with the previous import?
dotenv.config();

// After importing prisma, we initialize a new PrismaClient
const prisma = new PrismaClient();

// we declare app as a var that is an express() server function. 5) What does this express() function entail?
const app = express();

//We declare a var port to keep it stable and avoid future typos errors
const port = process.env.PORT || 3001;

// Types

//Type SurveyParams works with id because for now that is how we handle the Surveys, through
//their ids. I wonder, 6) In case we include post methods for question editions, as well as other
//CRUD operations, whether we would have to declare something like
//QuestionParams

interface SurveyParams extends ParamsDictionary {
	id: string;
}
interface QuestionParams extends ParamsDictionary {
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

//app defines a use of json() format for the express server
app.use(express.json());

//app declares the use of cors
app.use(cors());

// Basic routes

// 7) Why _ instead of req?
//Because the request is open, as defined by the path /
//and synchronized with the frontend API
//The response is a message that says that the server is running
app.get('/', (_: Request, res: Response) => {
	res.json({ message: 'Survey API is running' });
});

// Survey routes

//Same here, we do not request anything, so it is a _ instead of a req,
// 8) what does the asyncHandler manages instead of just async?
// we declare the app. METHOD (path, (req, res cyle) => {
// handling logic for the content requested,
//in this case, we declare var surveys, we do an await prisma.element.method({handling})
//in this case, it is a findMany, this is, find every element inside survey entity
//that include questions, options true. //i.e. get them all (there are no restrictions at any level)

// response in json format with the content requested
// })
app.get('/surveys', asyncHandler(async (_: Request, res: Response) => {
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

//9) In this case, everything remains the same but now:
// app.Method is get, path is with specific Id, the async handler inside inclusde an async
//before req,res
// method findUnique
//where: id: equals required params id
//that includes everything else
app.get('/surveys/:id', asyncHandler<SurveyParams>(async (req, res) => {
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

//10) here, the post method is actually the same to the get. So the transformation
//happens somewhere else, not here.
//Here, we declare how through a specific path there will be a specific
//cycle/dynamic of request and response: we are I. requesting a unique survey
//the way we ensure this exists is through where: id: req.params.id
//and we include everything from that survey

//11) What if we would want to get only a specific part? Give me the code if, let's say
//I would want to request only the title, or only the questions

//Then, the response is basically the survey in json again. In this way, we ensure
//a dialogue between database and backend front API to be connected with the frontend

app.post('/surveys/:id', asyncHandler<SurveyParams>(async (req, res) => {
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