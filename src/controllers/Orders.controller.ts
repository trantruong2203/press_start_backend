import { Request, Response } from "express";
import { createOrder, deleteOrder, getAllOrders, getOrderById, updateOrder, getOrderByOrderCode } from "../services/Orders.service";

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

const getOrderStatusByOrderCodeController = async (req: Request, res: Response) => {
  try {
    const { orderCode } = req.params;
    const order = await getOrderByOrderCode(orderCode);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found", status: false });
    }
    
    res.status(200).json({ 
      message: "Order status retrieved successfully", 
      status: order.status,
      orderCode: order.order_code,
      total: order.total,
      paid_at: order.paid_at
    });
  } catch (error) {
    console.error("Error getting order status:", error);
    res.status(500).json({ message: "Internal server error", status: false });
  }
};

export { createOrderController, getAllOrdersController, getOrderByIdController, updateOrderController, deleteOrderController, getOrderStatusByOrderCodeController }; 