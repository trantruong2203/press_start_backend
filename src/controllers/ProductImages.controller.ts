import { Request, Response } from "express";
import { createProductImage, deleteProductImage, getAllProductImages, getProductImageById, updateProductImage } from "../services/ProductImages.service";

const createProductImageController = async (req: Request, res: Response) => {
  const image = req.body;
  const result = await createProductImage(image);
  res.status(201).json({ message: "Product image created successfully", data: result });
};

const getAllProductImagesController = async (req: Request, res: Response) => {
  const result = await getAllProductImages();
  res.status(200).json({ message: "Product images fetched successfully", data: result });
};

const getProductImageByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getProductImageById(Number(id));
  res.status(200).json({ message: "Product image fetched successfully", data: result });
};

const updateProductImageController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const image = req.body;
  const result = await updateProductImage(Number(id), image);
  res.status(200).json({ message: "Product image updated successfully", data: result });
};

const deleteProductImageController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteProductImage(Number(id));
  res.status(200).json({ message: "Product image deleted successfully", data: result });
};

export { createProductImageController, getAllProductImagesController, getProductImageByIdController, updateProductImageController, deleteProductImageController }; 