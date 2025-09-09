import { Router } from   'express';
import { createOrderItemController, deleteOrderItemController, getAllOrderItemsController, getOrderItemByIdController, updateOrderItemController } from "../controllers/OrderItems.controller";

const router = Router();

router.post('/create', createOrderItemController);
router.get('/', getAllOrderItemsController);
router.get('/:id', getOrderItemByIdController);
router.put('/:id', updateOrderItemController);
router.delete('/:id', deleteOrderItemController);
export default router; 