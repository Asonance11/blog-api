import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Comment from '../models/comment';
import Post from '../models/post';
import { IUser } from '../models/user';

export const createComment = [
	body('comment')
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage('Comment must not be empty'),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				res.status(400).json({ errors: errors.array() });
				return;
			}

			const post = await Post.findById(req.params.postid);

			if (!post) {
				res.status(404).json({ message: 'Post not found' });
				return;
			}

			const user = req.user as IUser | undefined;

			if (!user) {
				res.status(401).json({ message: 'Unauthorized' });
				return;
			}

			const { comment } = req.body;

			const newComment = new Comment({
				comment,
				user: user._id,
				post: req.params.postid,
			});

			await newComment.save();

			res
				.status(201)
				.json({ message: 'Comment created successfully', newComment });
		} catch (error: any) {
			console.error(error);

			if (error.name === 'ValidationError') {
				return res
					.status(400)
					.json({ message: 'Validation error', errors: error.errors });
			}
			res.status(500).json({ message: 'Internal server error' });
		}
	},
];
