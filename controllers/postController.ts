import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import Comment from "../models/comment";
import Post from "../models/post";
import { IUser } from "../models/user";

export const allPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("user", { username: 1 })
      .exec();

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message.toString() });
  }
};

export const getLatestPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("user", { username: 1 })
      .exec();

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message.toString() });
  }
};

export const singlePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.postid)
      .populate("user", { username: 1 })
      .exec();

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message.toString() });
  }
};

export const createPost = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Title must not be empty."),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Content must not be empty."),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const user = req.user as IUser | undefined;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { title, content, imageUrl } = req.body;

      const post = new Post({
        title,
        content,
        imageUrl,
        user: user._id,
      });

      await post.save();

      res.status(201).json({ message: "Post created successfully", post });
    } catch (error: any) {
      console.error(error);

      if (error.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

export const updatePost = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Title must not be empty."),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Content must not be empty."),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }

      const user = req.user as IUser | undefined;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { title, content } = req.body;

      const post = await Post.findByIdAndUpdate(req.params.postid, {
        title,
        content,
      });

      if (!post) {
        res
          .status(404)
          .json({ message: `Post with id ${req.params.postid} not found` });
      }

      res.status(200).json({ message: "Post updated successfully" });
    } catch (error: any) {
      console.error(error);

      if (error.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IUser | undefined;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const post = await Post.findByIdAndDelete(req.params.postid);

    if (!post) {
      res
        .status(404)
        .json({ message: `Post with id ${req.params.postid} not found` });
    }
    const comments = await Comment.deleteMany({ post: req.params.postid });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
  }
};
