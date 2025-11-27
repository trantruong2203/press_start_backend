import { Router } from "express";
import {
  createOrderItemController,
  deleteOrderItemController,
  getAllOrderItemsController,
  getOrderItemByIdController,
  updateOrderItemController,
} from "../controllers/OrderItems.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  idParamSchema,
  orderItemCreateSchema,
  orderItemUpdateSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: orderItemCreateSchema }),
  createOrderItemController,
);
router.get("/", getAllOrderItemsController);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getOrderItemByIdController,
);
router.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: orderItemUpdateSchema }),
  updateOrderItemController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deleteOrderItemController,
);
export default router; 