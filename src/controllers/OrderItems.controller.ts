import { Request, Response } from "express";
import { createOrderItem, deleteOrderItem, getAllOrderItems, getOrderItemById, updateOrderItem } from "../services/OrderItems.service";

const createOrderItemController = async (req: Request, res: Response) => {
  const item = req.body;
  const result = await createOrderItem(item);
  res.status(201).json({ message: "Order item created successfully", data: result });
};

const getAllOrderItemsController = async (req: Request, res: Response) => {
  const result = await getAllOrderItems();
  res.status(200).json({ message: "Order items fetched successfully", data: result });
};

const getOrderItemByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getOrderItemById(Number(id));
  res.status(200).json({ message: "Order item fetched successfully", data: result });
};

const updateOrderItemController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = req.body;
  const result = await updateOrderItem(Number(id), item);
  res.status(200).json({ message: "Order item updated successfully", data: result });
};

const deleteOrderItemController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteOrderItem(Number(id));
  res.status(200).json({ message: "Order item deleted successfully", data: result });
};

export { createOrderItemController, getAllOrderItemsController, getOrderItemByIdController, updateOrderItemController, deleteOrderItemController }; 