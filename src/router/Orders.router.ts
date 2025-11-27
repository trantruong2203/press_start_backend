import { Router } from "express";
import {
  createOrderController,
  deleteOrderController,
  getAllOrdersController,
  getOrderByIdController,
  getOrderStatusByOrderCodeController,
  updateOrderController,
} from "../controllers/Orders.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  idParamSchema,
  orderCodeParamSchema,
  orderCreateSchema,
  orderUpdateSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/",
  validateRequest({ body: orderCreateSchema }),
  createOrderController,
);
router.get("/", getAllOrdersController);
router.get(
  "/status/:orderCode",
  validateRequest({ params: orderCodeParamSchema }),
  getOrderStatusByOrderCodeController,
);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getOrderByIdController,
);
router.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: orderUpdateSchema }),
  updateOrderController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deleteOrderController,
);
export default router; 