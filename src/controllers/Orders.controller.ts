import { Request, Response } from "express";
import { createOrder, deleteOrder, getAllOrders, getOrderById, updateOrder } from "../services/Orders.service";

const createOrderController = async (req: Request, res: Response) => {
  const order = req.body;
  const result = await createOrder(order);
  res.status(201).json({ message: "Order created successfully", data: result });
};

const getAllOrdersController = async (req: Request, res: Response) => {
  const result = await getAllOrders();
  res.status(200).json({ message: "Orders fetched successfully", data: result });
};

const getOrderByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getOrderById(Number(id));
  res.status(200).json({ message: "Order fetched successfully", data: result });
};

const updateOrderController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = req.body;
  const result = await updateOrder(Number(id), order);
  res.status(200).json({ message: "Order updated successfully", data: result });
};

const deleteOrderController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteOrder(Number(id));
  res.status(200).json({ message: "Order deleted successfully", data: result });
};

export { createOrderController, getAllOrdersController, getOrderByIdController, updateOrderController, deleteOrderController }; 