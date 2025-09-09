import { createCategoryController, deleteCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController } from "../controllers/Categories.controller";
import { Router } from 'express';

const router = Router();

router.post('/create', createCategoryController);
router.get('/', getAllCategoriesController);
router.get('/:id', getCategoryByIdController);
router.put('/:id', updateCategoryController);
router.delete('/:id', deleteCategoryController);
export default router;