import { Router } from "express";
import {
  createAccountPoolController,
  deleteAccountPoolController,
  getAccountPoolByIdController,
  getAllAccountPoolController,
  updateAccountPoolController,
} from "../controllers/AccountPool.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  accountPoolCreateSchema,
  accountPoolUpdateSchema,
  idParamSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: accountPoolCreateSchema }),
  createAccountPoolController,
);
router.get("/", getAllAccountPoolController);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getAccountPoolByIdController,
);
router.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: accountPoolUpdateSchema }),
  updateAccountPoolController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deleteAccountPoolController,
);
export default router; 