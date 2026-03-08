import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
  updateUser,
  login,
} from "../services/Users.service";
import { catchAsync } from "../utils/catchAsync";
import { ApiError } from "../utils/ApiError";

interface LoginResponse {
  token: string;
}

const createUserController = catchAsync(async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  const data = await createUser(username, password, email);
  res.status(201).json({
    message: "User created successfully",
    data,
  });
});

const getAllUsersController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getAllUsers();
    res.status(200).json({
      message: "Users fetched successfully",
      data: result,
    });
  },
);

const getUserByEmailController = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.params;
    const result = await getUserByEmail(email);
    if (!result) {
      throw new ApiError(404, "User not found");
    }
    res.status(200).json({
      message: "User fetched successfully",
      data: result,
    });
  },
);

const loginController = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = (await login(email, password)) as LoginResponse;

  res.cookie("token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Login successful",
    data: data.token,
  });
});

const logoutController = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

const updateUserController = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const { phone, avatar } = req.body;
  const result = await updateUser(email, phone, avatar);
  res.status(200).json({
    message: "User updated successfully",
    data: result,
  });
});

const deleteUserController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteUser(Number(id));
  res.status(200).json({
    message: "User deleted successfully",
    data: result,
  });
});

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  res.json({ user: req.user });
});

export {
  createUserController,
  getAllUsersController,
  getUserByEmailController,
  updateUserController,
  deleteUserController,
  loginController,
  getCurrentUser,
  logoutController,
};
