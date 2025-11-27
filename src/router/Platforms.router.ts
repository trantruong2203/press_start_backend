import { Router } from "express";
import {
  createPlatformController,
  deletePlatformController,
  getAllPlatformsController,
  getPlatformByIdController,
  updatePlatformController,
} from "../controllers/Platforms.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  idParamSchema,
  platformCreateSchema,
  platformUpdateSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: platformCreateSchema }),
  createPlatformController,
);
router.get("/", getAllPlatformsController);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getPlatformByIdController,
);
router.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: platformUpdateSchema }),
  updatePlatformController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deletePlatformController,
);
export default router; 