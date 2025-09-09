import { Router } from   'express';
import { createCommentController, deleteCommentController, getAllCommentsController, getCommentByIdController, updateCommentController } from "../controllers/Comments.controller";

const router = Router();

router.post('/create', createCommentController);
router.get('/', getAllCommentsController);
router.get('/:id', getCommentByIdController);
router.put('/:id', updateCommentController);
router.delete('/:id', deleteCommentController);
export default router; 