import { Router } from   'express';
import { createPlatformController, deletePlatformController, getAllPlatformsController, getPlatformByIdController, updatePlatformController } from "../controllers/Platforms.controller";

const router = Router();

router.post('/create', createPlatformController);
router.get('/', getAllPlatformsController);
router.get('/:id', getPlatformByIdController);
router.put('/:id', updatePlatformController);
router.delete('/:id', deletePlatformController);
export default router; 