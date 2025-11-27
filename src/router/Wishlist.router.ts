import { Router } from "express";
import {
  createWishlistController,
  deleteWishlistController,
  getAllWishlistController,
  getWishlistByIdController,
  updateWishlistController,
} from "../controllers/Wishlist.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  idParamSchema,
  wishlistCreateSchema,
  wishlistUpdateSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: wishlistCreateSchema }),
  createWishlistController,
);
router.get("/", getAllWishlistController);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getWishlistByIdController,
);
router.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: wishlistUpdateSchema }),
  updateWishlistController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deleteWishlistController,
);
export default router; 