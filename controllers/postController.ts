import { NextFunction, Request, Response } from 'express';
import Post from '../models/post';

export const allPosts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const posts = await Post.find({})
			.sort({ createdAt: -1 })
			.populate('user')
			.exec();

		res.json(posts);
	} catch (error: any) {
		res.status(500).json({ error: error.message.toString() });
	}
};
