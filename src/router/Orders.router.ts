import { Router } from   'express';
import { createOrderController, deleteOrderController, getAllOrdersController, getOrderByIdController, updateOrderController, getOrderStatusByOrderCodeController } from "../controllers/Orders.controller";

const router = Router();

router.post('/', createOrderController);
router.get('/', getAllOrdersController);
router.get('/:id', getOrderByIdController);
router.get('/status/:orderCode', getOrderStatusByOrderCodeController);
router.put('/:id', updateOrderController);
router.delete('/:id', deleteOrderController);
export default router; 