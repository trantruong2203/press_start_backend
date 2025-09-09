import { Router } from   'express';
import { createPaymentController, deletePaymentController, getAllPaymentsController, getPaymentByIdController, updatePaymentController } from "../controllers/Payments.controller";

const router = Router();

router.post('/create', createPaymentController);
router.get('/', getAllPaymentsController);
router.get('/:id', getPaymentByIdController);
router.put('/:id', updatePaymentController);
router.delete('/:id', deletePaymentController);
export default router; 