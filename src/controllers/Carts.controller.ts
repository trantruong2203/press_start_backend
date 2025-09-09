import { Request, Response } from "express";
import { createCart, deleteCart, getAllCarts, getCartById, updateCart } from "../services/Carts.service";

const createCartController = async (req: Request, res: Response) => {
  const cart = req.body;
  const result = await createCart(cart);
  res.status(201).json({ message: "Cart created successfully", data: result });
};

const getAllCartsController = async (req: Request, res: Response) => {
  const result = await getAllCarts();
  res.status(200).json({ message: "Carts fetched successfully", data: result });
};

const getCartByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getCartById(Number(id));
  res.status(200).json({ message: "Cart fetched successfully", data: result });
};

const updateCartController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cart = req.body;
  const result = await updateCart(Number(id), cart);
  res.status(200).json({ message: "Cart updated successfully", data: result });
};

const deleteCartController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteCart(Number(id));
  res.status(200).json({ message: "Cart deleted successfully", data: result });
};

export { createCartController, getAllCartsController, getCartByIdController, updateCartController, deleteCartController }; 