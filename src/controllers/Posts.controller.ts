import { Request, Response } from "express";
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from "../services/Posts.service";

const createPostController = async (req: Request, res: Response) => {
  const p = req.body;
  const result = await createPost(p);
  res.status(201).json({ message: "Post created successfully", data: result });
};

const getAllPostsController = async (req: Request, res: Response) => {
  const result = await getAllPosts();
  res.status(200).json({ message: "Posts fetched successfully", data: result });
};

const getPostByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getPostById(Number(id));
  res.status(200).json({ message: "Post fetched successfully", data: result });
};

const updatePostController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const p = req.body;
  const result = await updatePost(Number(id), p);
  res.status(200).json({ message: "Post updated successfully", data: result });
};

const deletePostController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deletePost(Number(id));
  res.status(200).json({ message: "Post deleted successfully", data: result });
};

export { createPostController, getAllPostsController, getPostByIdController, updatePostController, deletePostController };
