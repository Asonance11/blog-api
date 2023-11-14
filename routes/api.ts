import express from 'express';
import { login, logout, signup } from '../controllers/authController';
import { allPosts } from '../controllers/postController';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

// POSTS

router.get('/posts', allPosts);

export default router;
