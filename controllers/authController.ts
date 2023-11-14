import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/user';

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
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.json({ errors: errors.array() });
			return;
		}

		try {
			const userExists = await User.findOne({ username: req.body.username });

			if (userExists) {
				res.status(400).json({ message: 'User already exists' });
				return;
			}

			const hashedPassword = await bcrypt.hash(req.body.password, 10);

			const user = new User({
				username: req.body.username,
				password: hashedPassword,
				member: false,
				admin: false,
			});

			await user.save();

			res.status(201).json({ message: 'User created' });
		} catch (error: any) {
			return res.status(500).json({ message: error.message.toString() });
		}
	},
];
