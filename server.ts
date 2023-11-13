import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import indexRouter from './routes/index';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const mongoUrl =
	process.env.MONGODB_URL || 'mongodb://localhost:27017/members_only';

async function connectToMongoDB() {
	try {
		await mongoose.connect(mongoUrl);
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error('Failed to connect to MongoDB:', error);
		process.exit(1);
	}
}

app.use('/', indexRouter);

async function startServer() {
	try {
		await connectToMongoDB();
		app.listen(port, () => {
			console.log(`Server is running on http://localhost:${port}`);
		});
	} catch (error) {
		console.error('Failed to start the server:', error);
	}
}

startServer();

export default app;
