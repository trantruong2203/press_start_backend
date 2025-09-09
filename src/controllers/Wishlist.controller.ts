import { Request, Response } from "express";
import { createWishlist, deleteWishlist, getAllWishlist, getWishlistById, updateWishlist } from "../services/Wishlist.service";

const createWishlistController = async (req: Request, res: Response) => {
  const w = req.body;
  const result = await createWishlist(w);
  res.status(201).json({ message: "Wishlist created successfully", data: result });
};

const getAllWishlistController = async (req: Request, res: Response) => {
  const result = await getAllWishlist();
  res.status(200).json({ message: "Wishlist fetched successfully", data: result });
};

const getWishlistByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getWishlistById(Number(id));
  res.status(200).json({ message: "Wishlist fetched successfully", data: result });
};

const updateWishlistController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const w = req.body;
  const result = await updateWishlist(Number(id), w);
  res.status(200).json({ message: "Wishlist updated successfully", data: result });
};

const deleteWishlistController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteWishlist(Number(id));
  res.status(200).json({ message: "Wishlist deleted successfully", data: result });
};

export { createWishlistController, getAllWishlistController, getWishlistByIdController, updateWishlistController, deleteWishlistController }; 