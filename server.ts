import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/user';
import apiRouter from './routes/api';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	session({
		secret: process.env.SESSION_SECRET as string,
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());
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

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ username: username });
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				return done(null, false, { message: 'Incorrect password.' });
			}

			return done(null, user);
		} catch (error) {
			return done(error);
		}
	})
);

passport.serializeUser((user: any, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (error) {
		done(error);
	}
});

app.use('/api', apiRouter);

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
