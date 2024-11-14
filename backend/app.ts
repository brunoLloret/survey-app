import express from "express";
import cors from 'cors';

const app = express();

app.use(
	cors({
		origin: ['origin(s)'],
		allowedHeaders: ['Content-Type'],
	})
);
		
app.use(express.json());
	
app.use('[path], [router]');

export default app;
