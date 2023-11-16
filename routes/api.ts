import express from 'express';
import { login, logout, signup } from '../controllers/authController';
import {
	allPosts,
	createPost,
	singlePost,
} from '../controllers/postController';
import protectedRoute from '../middleware/protectedRoute';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

// POSTS

router.get('/posts', allPosts);

router.get('/posts/:postid', singlePost);

router.post('/create-post', protectedRoute, createPost);

export default router;
