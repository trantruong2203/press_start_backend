import { Router } from "express";
import {
  createPostController,
  deletePostController,
  getAllPostsController,
  getPostByIdController,
  updatePostController,
} from "../controllers/Posts.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import { idParamSchema, postCreateSchema, postUpdateSchema } from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: postCreateSchema }),
  createPostController,
);
router.get("/", getAllPostsController);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getPostByIdController,
);
router.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: postUpdateSchema }),
  updatePostController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deletePostController,
);
export default router; 