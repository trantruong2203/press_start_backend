import { Router } from   'express';
import { createCartController, deleteCartController, getAllCartsController, getCartByIdController, updateCartController } from "../controllers/Carts.controller";

const router = Router();

router.post('/create', createCartController);
router.get('/', getAllCartsController);
router.get('/:id', getCartByIdController);
router.put('/:id', updateCartController);
router.delete('/:id', deleteCartController);
export default router; 