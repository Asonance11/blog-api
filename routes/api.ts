import express from 'express';
import { login, logout, signup } from '../controllers/authController';
import {
	allPosts,
	createPost,
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

router.put('/posts/:postid/update', protectedRoute, updatePost);

export default router;
