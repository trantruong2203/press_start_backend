import { Router } from   'express';
import { createProductImageController, deleteProductImageController, getAllProductImagesController, getProductImageByIdController, updateProductImageController } from "../controllers/ProductImages.controller";

const router = Router();

router.post('/create', createProductImageController);
router.get('/', getAllProductImagesController);
router.get('/:id', getProductImageByIdController);
router.put('/:id', updateProductImageController);
router.delete('/:id', deleteProductImageController);
export default router; 