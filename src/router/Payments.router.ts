import { Router } from   'express';
import { createPaymentController, deletePaymentController, getAllPaymentsController, getPaymentByIdController, updatePaymentController, createPayOSCheckoutLinkController } from "../controllers/Payments.controller";

const router = Router();

router.post('/create', createPaymentController);
router.get('/', getAllPaymentsController);
router.get('/:id', getPaymentByIdController);
router.put('/:id', updatePaymentController);
router.delete('/:id', deletePaymentController);
router.post('/payos/checkout-link', createPayOSCheckoutLinkController);
export default router; 