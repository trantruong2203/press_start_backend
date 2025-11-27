import { Router } from "express";
import {
  createProductCategoryController,
  deleteProductCategoryController,
  getAllProductCategoriesController,
  getProductCategoryByIdController,
  updateProductCategoryController,
} from "../controllers/ProductCate.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  idParamSchema,
  productCategoryCreateSchema,
  productCategoryUpdateSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: productCategoryCreateSchema }),
  createProductCategoryController,
);
router.get("/", getAllProductCategoriesController);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getProductCategoryByIdController,
);
router.put(
  "/:id",
  validateRequest({
    params: idParamSchema,
    body: productCategoryUpdateSchema,
  }),
  updateProductCategoryController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deleteProductCategoryController,
);
export default router;