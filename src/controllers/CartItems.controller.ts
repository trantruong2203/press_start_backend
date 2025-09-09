import { Request, Response } from "express";
import { createCartItem, deleteCartItem, getAllCartItems, getCartItemById, updateCartItem } from "../services/CartItems.service";

const createCartItemController = async (req: Request, res: Response) => {
  const item = req.body;
  const result = await createCartItem(item);
  res.status(201).json({ message: "Cart item created successfully", data: result });
};

const getAllCartItemsController = async (req: Request, res: Response) => {
  const result = await getAllCartItems();
  res.status(200).json({ message: "Cart items fetched successfully", data: result });
};

const getCartItemByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getCartItemById(Number(id));
  res.status(200).json({ message: "Cart item fetched successfully", data: result });
};

const updateCartItemController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = req.body;
  const result = await updateCartItem(Number(id), item);
  res.status(200).json({ message: "Cart item updated successfully", data: result });
};

const deleteCartItemController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteCartItem(Number(id));
  res.status(200).json({ message: "Cart item deleted successfully", data: result });
};

export { createCartItemController, getAllCartItemsController, getCartItemByIdController, updateCartItemController, deleteCartItemController }; 