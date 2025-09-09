import { Request, Response } from "express";
import { createSeller, deleteSeller, getAllSellers, getSellerById, getSellersByProduct, updateSeller } from "../services/Seller.service";

const createSellerController = async (req: Request, res: Response) => {
  const seller = req.body;
  const result = await createSeller(seller);
  res.status(201).json({
    message: "Seller created successfully",
    data: result,
  });
};

const getAllSellersController = async (req: Request, res: Response) => {
  const result = await getAllSellers();
  res.status(200).json({
    message: "Sellers fetched successfully",
    data: result,
  });
};

const getSellerByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getSellerById(Number(id));
  res.status(200).json({
    message: "Seller fetched successfully",
    data: result,
  });
};

const updateSellerController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const seller = req.body;
  const result = await updateSeller(Number(id), seller);
  res.status(200).json({
    message: "Seller updated successfully",
    data: result,
  });
};

const deleteSellerController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteSeller(Number(id));
  res.status(200).json({
    message: "Seller deleted successfully",
    data: result,
  });
};

const getSellersByProductController = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await getSellersByProduct(Number(productId));
  
  res.status(200).json({
    message: "Sellers for product fetched successfully",
    data: result,
  });
};

export { createSellerController, getAllSellersController, getSellerByIdController, getSellersByProductController, updateSellerController, deleteSellerController };