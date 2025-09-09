import { Router } from 'express';
import { createProductCategoryController, deleteProductCategoryController, getAllProductCategoriesController, getProductCategoryByIdController, updateProductCategoryController } from "../controllers/ProductCate.controller";

const router = Router();

router.post('/create', createProductCategoryController);
router.get('/', getAllProductCategoriesController);
router.get('/:id', getProductCategoryByIdController);
router.put('/:id', updateProductCategoryController);
router.delete('/:id', deleteProductCategoryController);
export default router;