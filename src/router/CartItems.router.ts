import { Router } from   'express';
import { createCartItemController, deleteCartItemController, getAllCartItemsController, getCartItemByIdController, updateCartItemController } from "../controllers/CartItems.controller";

const router = Router();

router.post('/create', createCartItemController);
router.get('/', getAllCartItemsController);
router.get('/:id', getCartItemByIdController);
router.put('/:id', updateCartItemController);
router.delete('/:id', deleteCartItemController);
export default router; 