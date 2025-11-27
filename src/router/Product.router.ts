import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getAllProductsWithLowestPriceController,
  getProductByIdController,
  getProductWithSellersController,
  updateProductController,
} from "../controllers/Product.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  idParamSchema,
  productCreateSchema,
  productUpdateSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: productCreateSchema }),
  createProductController,
);
router.get("/", getAllProductsController);
router.get("/with-lowest-price", getAllProductsWithLowestPriceController);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getProductByIdController,
);
router.get(
  "/:id/with-sellers",
  validateRequest({ params: idParamSchema }),
  getProductWithSellersController,
);
router.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: productUpdateSchema }),
  updateProductController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deleteProductController,
);

export default router;