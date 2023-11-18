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

			await post.updateOne({ $push: { comments: newComment._id } });

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

export const commentsByPost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user as IUser | undefined;

		if (!user) {
			res.status(401).json({ message: 'Unauthorized' });
			return;
		}

		const comments = await Comment.find({ post: req.params.postid })
			.populate('user', { username: 1 })
			.exec();

		res.status(200).json({ comments });
	} catch (error) {
		console.error(error);
		res.status(200).json({ message: 'No comments' });
	}
};

export const deleteComment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user as IUser | undefined;

		if (!user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const comment = await Comment.findByIdAndDelete(req.params.commentid);

		if (!comment) {
			res
				.status(404)
				.json({ message: `Comment with id ${req.params.commentid} not found` });
		}

		await Post.findByIdAndUpdate(req.params.postid, {
			$pull: { comments: req.params.commentid },
		});

		res.status(200).json({ message: 'Comment deleted successfully' });
	} catch (error: any) {
		res.status(500).json({ message: 'Internal server error' });
	}
};
