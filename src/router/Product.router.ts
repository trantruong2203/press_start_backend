import { Router } from "express";
import {
  createProductController,
  getAllProductsController,
  getAllProductsWithLowestPriceController,
  getProductByIdController,
  getProductWithSellersController,
  updateProductController,
  deleteProductController,
} from "../controllers/Product.controller";
import { validate } from "../middlewares/Validate.middleware";
import {
  createProductSchema,
  getProductSchema,
  updateProductSchema,
} from "../validation/Product.validation";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllProductsController);
router.get("/with-lowest-price", getAllProductsWithLowestPriceController);
router.get("/:id", validate(getProductSchema), getProductByIdController);
router.get(
  "/:id/with-sellers",
  validate(getProductSchema),
  getProductWithSellersController,
);

// Admin only routes
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

router.post("/create", validate(createProductSchema), createProductController);
router.put("/:id", validate(updateProductSchema), updateProductController);
router.delete("/:id", validate(getProductSchema), deleteProductController);

export default router;
