import { Router } from "express";
import {
  createCommentController,
  deleteCommentController,
  getAllCommentsController,
  getCommentByIdController,
  updateCommentController,
} from "../controllers/Comments.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  commentCreateSchema,
  commentUpdateSchema,
  idParamSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: commentCreateSchema }),
  createCommentController,
);
router.get("/", getAllCommentsController);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getCommentByIdController,
);
router.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: commentUpdateSchema }),
  updateCommentController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deleteCommentController,
);
export default router; 