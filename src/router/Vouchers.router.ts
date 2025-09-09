import { Router } from   'express';
import { createVoucherController, deleteVoucherController, getAllVouchersController, getVoucherByIdController, updateVoucherController } from "../controllers/Vouchers.controller";

const router = Router();

router.post('/create', createVoucherController);
router.get('/', getAllVouchersController);
router.get('/:id', getVoucherByIdController);
router.put('/:id', updateVoucherController);
router.delete('/:id', deleteVoucherController);
export default router; 