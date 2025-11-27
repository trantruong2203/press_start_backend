import { Router } from "express";
import {
  createProductImageController,
  deleteProductImageController,
  getAllProductImagesController,
  getProductImageByIdController,
  updateProductImageController,
} from "../controllers/ProductImages.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  idParamSchema,
  productImageCreateSchema,
  productImageUpdateSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: productImageCreateSchema }),
  createProductImageController,
);
router.get("/", getAllProductImagesController);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getProductImageByIdController,
);
router.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: productImageUpdateSchema }),
  updateProductImageController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deleteProductImageController,
);
export default router; 