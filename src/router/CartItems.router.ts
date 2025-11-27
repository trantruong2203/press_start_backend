import { Router } from "express";
import {
  createCartItemController,
  deleteCartItemController,
  getAllCartItemsController,
  getCartItemByIdController,
  updateCartItemController,
} from "../controllers/CartItems.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  cartItemCreateSchema,
  cartItemUpdateSchema,
  idParamSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: cartItemCreateSchema }),
  createCartItemController,
);
router.get("/", getAllCartItemsController);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getCartItemByIdController,
);
router.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: cartItemUpdateSchema }),
  updateCartItemController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deleteCartItemController,
);
export default router; 