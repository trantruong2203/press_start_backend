import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "../controllers/Categories.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
  idParamSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: categoryCreateSchema }),
  createCategoryController,
);
router.get("/", getAllCategoriesController);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getCategoryByIdController,
);
router.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: categoryUpdateSchema }),
  updateCategoryController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deleteCategoryController,
);
export default router;