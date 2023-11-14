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

export const singlePost = async (req: Request, res: Response) => {
	const post = await Post.findById(req.params.postid).populate('user').exec();

	if (!post) {
		res.status(404).json({ error: 'Post not found' });
		return;
	}

	res.json(post);
};
