import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "../controllers/Categories.controller";
import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);

// Admin only
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

router.post("/create", createCategoryController);
router.put("/:id", updateCategoryController);
router.delete("/:id", deleteCategoryController);

export default router;
