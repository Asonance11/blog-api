import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { IUser } from '../models/user';

const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate(
		'jwt',
		{ session: false },
		(err: Error | null, user: IUser) => {
			if (err) {
				res.status(500).json({ message: 'Error authenticating user' });
			}

			if (!user) {
				return res.status(401).json({ message: 'Unauthorized' });
			}
			next();
		}
	)(req, res, next);
};

export default protectedRoute;
