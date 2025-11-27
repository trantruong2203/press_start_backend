import { Router } from "express";
import {
  createSellerController,
  deleteSellerController,
  getAllSellersController,
  getSellerByIdController,
  getSellersByProductController,
  updateSellerController,
} from "../controllers/Sellers.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  idParamSchema,
  productIdParamSchema,
  sellerCreateSchema,
  sellerUpdateSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: sellerCreateSchema }),
  createSellerController,
);
router.get("/", getAllSellersController);
router.get(
  "/by-product/:productId",
  validateRequest({ params: productIdParamSchema }),
  getSellersByProductController,
);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getSellerByIdController,
);
router.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: sellerUpdateSchema }),
  updateSellerController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deleteSellerController,
);

export default router;