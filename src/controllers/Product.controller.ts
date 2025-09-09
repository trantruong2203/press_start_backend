import { Request, Response } from "express";
import { createProduct, deleteProduct, getAllProducts, getAllProductsWithLowestPrice, getProductById, getProductWithSellers, updateProduct } from "../services/Product.service";

const createProductController = async (req: Request, res: Response) => {
  const product = req.body;
  const result = await createProduct(product);
  res.status(201).json({
    message: "Product created successfully",
    data: result,
  });
};

const getAllProductsController = async (req: Request, res: Response) => {
  const result = await getAllProducts();
  res.status(200).json({
    message: "Products fetched successfully",
    data: result,
  });
};

const getProductByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getProductById(Number(id));
  res.status(200).json({
    message: "Product fetched successfully",
    data: result,
  });
};

const  updateProductController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = req.body;
  
  try {
    const result = await updateProduct(Number(id), product);
    
    if (!result) {
      return res.status(404).json({
        message: "Product not found",
        data: null,
      });
    }
    
    res.status(200).json({
      message: "Product updated successfully",
      data: result,
    });
  } catch (error) {
    console.error('Error in updateProductController:', error);
    res.status(500).json({
      message: "Error updating product",
      data: null,
    });
  }
};

const deleteProductController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteProduct(Number(id));
  res.status(200).json({
    message: "Product deleted successfully",
    data: result,
  });
};

const getProductWithSellersController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getProductWithSellers(Number(id));
  
  if (!result) {
    return res.status(404).json({
      message: "Product not found",
      data: null,
    });
  }

  res.status(200).json({
    message: "Product with sellers fetched successfully",
    data: result,
  });
};

const getAllProductsWithLowestPriceController = async (req: Request, res: Response) => {
  const result = await getAllProductsWithLowestPrice();
  res.status(200).json({
    message: "Products with lowest price fetched successfully",
    data: result,
  });
};

export { createProductController, getAllProductsController, getAllProductsWithLowestPriceController, getProductByIdController, getProductWithSellersController, updateProductController, deleteProductController };