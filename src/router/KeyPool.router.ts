import { Router } from "express";
import {
  createKeyPoolController,
  deleteKeyPoolController,
  getAllKeyPoolController,
  getKeyPoolByIdController,
  updateKeyPoolController,
} from "../controllers/KeyPool.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  idParamSchema,
  keyPoolCreateSchema,
  keyPoolUpdateSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: keyPoolCreateSchema }),
  createKeyPoolController,
);
router.get("/", getAllKeyPoolController);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getKeyPoolByIdController,
);
router.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: keyPoolUpdateSchema }),
  updateKeyPoolController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deleteKeyPoolController,
);
export default router; 