import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getAllUsersController,
  getCurrentUser,
  getUserByEmailController,
  loginController,
  logoutController,
  updateUserController,
} from "../controllers/Users.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  emailParamSchema,
  userCreateSchema,
  userLoginSchema,
  userUpdateSchema,
} from "../validation/schemas";

const router = Router();

router.post(
  "/create",
  validateRequest({ body: userCreateSchema }),
  createUserController,
);
router.post(
  "/login",
  validateRequest({ body: userLoginSchema }),
  loginController,
);
router.post("/logout", logoutController);

router.use(authMiddleware);

router.get("/", getAllUsersController);
router.get("/me", getCurrentUser);
router.get(
  "/:email",
  validateRequest({ params: emailParamSchema }),
  getUserByEmailController,
);
router.put(
  "/:email",
  validateRequest({ params: emailParamSchema, body: userUpdateSchema }),
  updateUserController,
);
router.delete(
  "/:email",
  validateRequest({ params: emailParamSchema }),
  deleteUserController,
);

export default router;