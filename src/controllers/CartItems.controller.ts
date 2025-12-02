import { Request, Response } from "express";
import {
  createCartItem,
  deleteCartItem,
  getAllCartItems,
  getCartItemById,
  updateCartItem,
} from "../services/CartItems.service";


// CREATE
const createCartItemController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const item = req.body;

    const result = await createCartItem({ ...item, user_id: userId });

    return res.status(201).json({
      message: "Cart item created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};


// GET ALL (BY USER)
const getAllCartItemsController = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const result = await getAllCartItems(userId);

    return res.status(200).json({
      message: "Cart items fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};


// GET ONE
const getCartItemByIdController = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const id = Number(req.params.id);

    const result = await getCartItemById(id, userId);

    if (!result) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.status(200).json({
      message: "Cart item fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};


// UPDATE
const updateCartItemController = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const id = Number(req.params.id);
    const item = req.body;

    const updated = await updateCartItem(id, userId, item);

    if (!updated) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.status(200).json({
      message: "Cart item updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};


// DELETE
const deleteCartItemController = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const id = Number(req.params.id);

    const deleted = await deleteCartItem(id, userId);

    if (!deleted) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.status(200).json({
      message: "Cart item deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};


export {
  createCartItemController,
  getAllCartItemsController,
  getCartItemByIdController,
  updateCartItemController,
  deleteCartItemController,
};
