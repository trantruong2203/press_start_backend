import { Request, Response } from "express";
import { createKeyPool, deleteKeyPool, getAllKeyPool, getKeyPoolById, updateKeyPool } from "../services/KeyPool.service";

const createKeyPoolController = async (req: Request, res: Response) => {
  const k = req.body;
  const result = await createKeyPool(k);
  res.status(201).json({ message: "Key pool created successfully", data: result });
};

const getAllKeyPoolController = async (req: Request, res: Response) => {
  const result = await getAllKeyPool();
  res.status(200).json({ message: "Key pool fetched successfully", data: result });
};

const getKeyPoolByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getKeyPoolById(Number(id));
  res.status(200).json({ message: "Key pool fetched successfully", data: result });
};

const updateKeyPoolController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const k = req.body;
  const result = await updateKeyPool(Number(id), k);
  res.status(200).json({ message: "Key pool updated successfully", data: result });
};

const deleteKeyPoolController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteKeyPool(Number(id));
  res.status(200).json({ message: "Key pool deleted successfully", data: result });
};

export { createKeyPoolController, getAllKeyPoolController, getKeyPoolByIdController, updateKeyPoolController, deleteKeyPoolController }; 