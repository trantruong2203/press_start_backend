import { Request, Response } from "express";
import { createComment, deleteComment, getAllComments, getCommentById, updateComment } from "../services/Comments.service";

const createCommentController = async (req: Request, res: Response) => {
  const c = req.body;
  const result = await createComment(c);
  res.status(201).json({ message: "Comment created successfully", data: result });
};

const getAllCommentsController = async (req: Request, res: Response) => {
  const result = await getAllComments();
  res.status(200).json({ message: "Comments fetched successfully", data: result });
};

const getCommentByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getCommentById(Number(id));
  res.status(200).json({ message: "Comment fetched successfully", data: result });
};

const updateCommentController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const c = req.body;
  const result = await updateComment(Number(id), c);
  res.status(200).json({ message: "Comment updated successfully", data: result });
};

const deleteCommentController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteComment(Number(id));
  res.status(200).json({ message: "Comment deleted successfully", data: result });
};

export { createCommentController, getAllCommentsController, getCommentByIdController, updateCommentController, deleteCommentController }; 