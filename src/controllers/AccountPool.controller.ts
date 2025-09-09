import { Request, Response } from "express";
import { createAccountPool, deleteAccountPool, getAccountPoolById, getAllAccountPool, updateAccountPool } from "../services/AccountPool.service";

const createAccountPoolController = async (req: Request, res: Response) => {
  const acc = req.body;
  const result = await createAccountPool(acc);
  res.status(201).json({ message: "Account pool created successfully", data: result });
};

const getAllAccountPoolController = async (req: Request, res: Response) => {
  const result = await getAllAccountPool();
  res.status(200).json({ message: "Account pool fetched successfully", data: result });
};

const getAccountPoolByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getAccountPoolById(Number(id));
  res.status(200).json({ message: "Account pool fetched successfully", data: result });
};

const updateAccountPoolController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const acc = req.body;
  const result = await updateAccountPool(Number(id), acc);
  res.status(200).json({ message: "Account pool updated successfully", data: result });
};

const deleteAccountPoolController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteAccountPool(Number(id));
  res.status(200).json({ message: "Account pool deleted successfully", data: result });
};

export { createAccountPoolController, getAllAccountPoolController, getAccountPoolByIdController, updateAccountPoolController, deleteAccountPoolController }; 