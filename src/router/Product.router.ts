import { Router } from   'express';
import { createProductController, getAllProductsController, getAllProductsWithLowestPriceController, getProductByIdController, getProductWithSellersController, updateProductController, deleteProductController } from "../controllers/Product.controller";

const router = Router();

router.post('/create', createProductController);
router.get('/', getAllProductsController);
router.get('/with-lowest-price', getAllProductsWithLowestPriceController);
router.get('/:id', getProductByIdController);
router.get('/:id/with-sellers', getProductWithSellersController);
router.put('/:id', updateProductController);
router.delete('/:id', deleteProductController);

export default router;