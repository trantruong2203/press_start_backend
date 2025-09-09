import { createUserController, deleteUserController, getAllUsersController, getCurrentUser, getUserByEmailController, loginController, logoutController, updateUserController } from "../controllers/Users.controller";
import { Router } from 'express';
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post('/create', createUserController);
router.post('/login', loginController);
router.post('/logout', logoutController);

router.use(authMiddleware);

router.get('/', getAllUsersController);
router.get('/me', getCurrentUser);
router.get('/:email', getUserByEmailController);
router.put('/:email', updateUserController);
router.delete('/:email', deleteUserController);

export default router;