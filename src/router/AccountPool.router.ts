import { Router } from   'express';
import { createAccountPoolController, deleteAccountPoolController, getAccountPoolByIdController, getAllAccountPoolController, updateAccountPoolController } from "../controllers/AccountPool.controller";

const router = Router();

router.post('/create', createAccountPoolController);
router.get('/', getAllAccountPoolController);
router.get('/:id', getAccountPoolByIdController);
router.put('/:id', updateAccountPoolController);
router.delete('/:id', deleteAccountPoolController);
export default router; 