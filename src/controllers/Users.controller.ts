import { NextFunction, Request, Response } from "express";
import { createUser, deleteUser, getAllUsers, getUserByEmail, updateUser, login } from "../services/Users.service";

interface LoginResponse {
  token: string;
}

const createUserController = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email } = req.body;
    try {
        await createUser(username, password, email);
        res.status(201).json({
            message: "User created successfully",
        });
    } catch (error: any) {
        next(error);
    }
};

const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllUsers();
    res.status(200).json({
      message: "Users fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUserByEmailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;
    const result = await getUserByEmail(email);
    res.status(200).json({
      message: "User fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
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

const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;
    const { phone, avatar } = req.body;
    const result = await updateUser(email, phone, avatar);
    res.status(200).json({
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await deleteUser(Number(id));
    res.status(200).json({
      message: "User deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
      res.json({ user: req.user});
  } catch (error) {
      next(error);
  }
};

export { createUserController, getAllUsersController, getUserByEmailController, updateUserController, deleteUserController, loginController, getCurrentUser, logoutController };