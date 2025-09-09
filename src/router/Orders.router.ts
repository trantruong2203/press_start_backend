import { Router } from   'express';
import { createOrderController, deleteOrderController, getAllOrdersController, getOrderByIdController, updateOrderController } from "../controllers/Orders.controller";

const router = Router();

router.post('/create', createOrderController);
router.get('/', getAllOrdersController);
router.get('/:id', getOrderByIdController);
router.put('/:id', updateOrderController);
router.delete('/:id', deleteOrderController);
export default router; 