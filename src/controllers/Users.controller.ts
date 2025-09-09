import { NextFunction, Request, Response } from "express";
import { createUser, deleteUser, getAllUsers, getUserByEmail, updateUser, login } from "../services/Users.service";

interface LoginResponse {
  token: string;
}

const createUserController = async (req: Request, res: Response) => {
    const { username, password, email } = req.body;
    try {
        const data = await createUser(username, password, email);
        res.status(201).json(data);
    } catch (error: any) {
        if (error.status) {
            res.status(error.status).json({ error: error.message });
        } else {
            res.status(500).json({ error });
        }
    }
};

const getAllUsersController = async (req: Request, res: Response) => {
  const result = await getAllUsers();
  res.status(200).json({
    message: "Users fetched successfully",
    data: result,
  });
};

const getUserByEmailController = async (req: Request, res: Response) => {
  const { email } = req.params;
  const result = await getUserByEmail(email);
  res.status(200).json({
    message: "User fetched successfully",
    data: result,
  });
};

const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const { email, password } = req.body;
      const data = await login(email, password) as LoginResponse;
      console.log("data",data);
      res.cookie('token', data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 2 * 60 * 60 * 1000,
      });
      res.status(200).json({
        message: "Login successful",
        data: data.token,
      });
  } catch (err) {
      next(err);
  }
};

const logoutController = async (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
};

const updateUserController = async (req: Request, res: Response) => {
  const { email } = req.params;
  const { phone, avatar } = req.body;
  const result = await updateUser(email, phone, avatar);
  res.status(200).json({
    message: "User updated successfully",
    data: result,
  });
};

const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteUser(Number(id));
  res.status(200).json({
    message: "User deleted successfully",
    data: result,
  });
};

const getCurrentUser = async (req: Request, res: Response) => {
  try {
      res.json({ user: req.user});
  } catch (error) {
      res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};

export { createUserController, getAllUsersController, getUserByEmailController, updateUserController, deleteUserController, loginController, getCurrentUser, logoutController };