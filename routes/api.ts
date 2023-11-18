import express from 'express';
import { login, logout, signup } from '../controllers/authController';
import {
	commentsByPost,
	createComment,
	deleteComment,
	singleComment,
} from '../controllers/commentController';
import {
	allPosts,
	createPost,
	deletePost,
	singlePost,
	updatePost,
} from '../controllers/postController';
import protectedRoute from '../middleware/protectedRoute';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

// POSTS

router.get('/posts', protectedRoute, allPosts);

router.get('/posts/:postid', protectedRoute, singlePost);

router.post('/posts', protectedRoute, createPost);

router.put('/posts/:postid', protectedRoute, updatePost);

router.delete('/posts/:postid', protectedRoute, deletePost);

// COMMENTS

router.get('/posts/:postid/comments', protectedRoute, commentsByPost);

router.post('/posts/:postid/comments', protectedRoute, createComment);

router.delete(
	'/posts/:postid/comments/:commentid',
	protectedRoute,
	deleteComment
);

router.get('/posts/:postid/comments/:commentid', protectedRoute, singleComment);

export default router;
