import { Router } from   'express';
import { createPostController, deletePostController, getAllPostsController, getPostByIdController, updatePostController } from "../controllers/Posts.controller";

const router = Router();

router.post('/create', createPostController);
router.get('/', getAllPostsController);
router.get('/:id', getPostByIdController);
router.put('/:id', updatePostController);
router.delete('/:id', deletePostController);
export default router; 