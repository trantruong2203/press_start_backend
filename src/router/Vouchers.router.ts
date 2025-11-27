import { Router } from "express";
import {
  createVoucherController,
  deleteVoucherController,
  getAllVouchersController,
  getVoucherByIdController,
  updateVoucherController,
} from "../controllers/Vouchers.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  idParamSchema,
  voucherCreateSchema,
  voucherUpdateSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: voucherCreateSchema }),
  createVoucherController,
);
router.get("/", getAllVouchersController);
router.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  getVoucherByIdController,
);
router.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: voucherUpdateSchema }),
  updateVoucherController,
);
router.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  deleteVoucherController,
);
export default router; 