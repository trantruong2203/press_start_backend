import { Router } from   'express';
import { createSellerController, getAllSellersController, getSellerByIdController, getSellersByProductController, updateSellerController, deleteSellerController } from "../controllers/Sellers.controller";

const router = Router();

router.post('/create', createSellerController);
router.get('/', getAllSellersController);
router.get('/by-product/:productId', getSellersByProductController);
router.get('/:id', getSellerByIdController);
router.put('/:id', updateSellerController);
router.delete('/:id', deleteSellerController);

export default router;