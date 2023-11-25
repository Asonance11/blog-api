import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User, { IUser } from '../models/user';

export const signup = [
	body('username')
		.trim()
		.isLength({ min: 3 })
		.withMessage('Username must consist of at least 3 characters'),
	body('password')
		.trim()
		.isLength({ min: 6 })
		.escape()
		.withMessage('Password must consist of at least 6 characters'),
	body('confirm_password')
		.trim()
		.escape()
		.custom(async (value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Passwords must be the same');
			}
		}),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				res.status(400).json({ errors: errors.array() });
				return;
			}
			const userExists = await User.findOne({ username: req.body.username });

			if (userExists) {
				res.status(400).json({ errors: [{ msg: 'User already exists' }] });
				return;
			}

			const hashedPassword = await bcrypt.hash(req.body.password, 10);

			const user = new User({
				username: req.body.username,
				password: hashedPassword,
			});

			await user.save();

			res.status(201).json({ message: 'User created' });
		} catch (error: any) {
			console.error(error);
			res.status(500).json({ message: 'Internal server error' });
		}
	},
];

export const login = [
	body('username')
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage('Username must consist of at least 3 characters'),
	body('password')
		.trim()
		.isLength({ min: 6 })
		.escape()
		.withMessage('Password must consist of at least 6 characters'),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				res.status(400).json({ errors: errors.array() });
				return;
			}
			passport.authenticate(
				'local',
				{ session: false },
				(err: Error | null, user: IUser, info: any) => {
					if (err) {
						res
							.status(500)
							.json({ errors: [{ msg: 'Error authenticating user' }] });
						return;
					}

					if (!user) {
						res
							.status(400)
							.json({ errors: [{ msg: 'Username or password incorrect' }] });
						return;
					}

					req.login(user, (loginErr) => {
						if (loginErr) {
							res
								.status(500)
								.json({ errors: [{ msg: 'Error logging in user' }] });
							return;
						}

						const token = jwt.sign(
							{ id: user._id, username: user.username },
							process.env.JWT_SECRET as string,
							{ expiresIn: '1d' }
						);

						res.status(200).json({ message: 'User logged in', token });
					});
				}
			)(req, res, next);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Internal server error' });
		}
	},
];

export const logout = (req: Request, res: Response, next: NextFunction) => {
	// req.logout();
	console.log('Logged out');
};
