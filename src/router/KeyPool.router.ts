import { Router } from   'express';
import { createKeyPoolController, deleteKeyPoolController, getAllKeyPoolController, getKeyPoolByIdController, updateKeyPoolController } from "../controllers/KeyPool.controller";

const router = Router();

router.post('/create', createKeyPoolController);
router.get('/', getAllKeyPoolController);
router.get('/:id', getKeyPoolByIdController);
router.put('/:id', updateKeyPoolController);
router.delete('/:id', deleteKeyPoolController);
export default router; 