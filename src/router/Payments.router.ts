import { Router } from "express";
import {
  createPaymentController,
  createPayOSCheckoutLinkController,
  deletePaymentController,
  getAllPaymentsController,
  getPaymentByIdController,
  updatePaymentController,
} from "../controllers/Payments.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  idParamSchema,
  payOsCheckoutSchema,
  paymentCreateSchema,
  paymentUpdateSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: paymentCreateSchema }),
  createPaymentController,
);
router.get("/", getAllPaymentsController);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getPaymentByIdController,
);
router.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: paymentUpdateSchema }),
  updatePaymentController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deletePaymentController,
);
router.post(
  "/payos/checkout-link",
  validateRequest({ body: payOsCheckoutSchema }),
  createPayOSCheckoutLinkController,
);
export default router; 