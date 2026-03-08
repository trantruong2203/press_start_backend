import { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getAllProductsWithLowestPrice,
  getProductById,
  getProductWithSellers,
  updateProduct,
} from "../services/Product.service";
import { catchAsync } from "../utils/catchAsync";
import { ApiError } from "../utils/ApiError";

const createProductController = catchAsync(
  async (req: Request, res: Response) => {
    const product = req.body;
    const result = await createProduct(product);
    res.status(201).json({
      message: "Product created successfully",
      data: result,
    });
  },
);

const getAllProductsController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getAllProducts();
    res.status(200).json({
      message: "Products fetched successfully",
      data: result,
    });
  },
);

const getProductByIdController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await getProductById(Number(id));
    if (!result) {
      throw new ApiError(404, "Product not found");
    }
    res.status(200).json({
      message: "Product fetched successfully",
      data: result,
    });
  },
);

const updateProductController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = req.body;

    const result = await updateProduct(Number(id), product);

    if (!result) {
      throw new ApiError(404, "Product not found");
    }

    res.status(200).json({
      message: "Product updated successfully",
      data: result,
    });
  },
);

const deleteProductController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteProduct(Number(id));
    res.status(200).json({
      message: "Product deleted successfully",
      data: result,
    });
  },
);

const getProductWithSellersController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await getProductWithSellers(Number(id));

    if (!result) {
      throw new ApiError(404, "Product not found");
    }

    res.status(200).json({
      message: "Product with sellers fetched successfully",
      data: result,
    });
  },
);

const getAllProductsWithLowestPriceController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getAllProductsWithLowestPrice();
    res.status(200).json({
      message: "Products with lowest price fetched successfully",
      data: result,
    });
  },
);

export {
  createProductController,
  getAllProductsController,
  getAllProductsWithLowestPriceController,
  getProductByIdController,
  getProductWithSellersController,
  updateProductController,
  deleteProductController,
};
