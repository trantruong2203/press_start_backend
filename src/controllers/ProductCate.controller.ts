import { Request, Response } from "express";
import { createProductCategory, deleteProductCategory, getAllProductCategories, getProductCategoryById, updateProductCategory } from "../services/ProductCate.service";

const createProductCategoryController = async (req: Request, res: Response) => {
  const productCategory = req.body;
  const result = await createProductCategory(productCategory);
  res.status(201).json({
    message: "Product Category created successfully",
    data: result,
  });
};

const getAllProductCategoriesController = async (req: Request, res: Response) => {
  const result = await getAllProductCategories();
  res.status(200).json({
    message: "Product Categories fetched successfully",
    data: result,
  });
};

const getProductCategoryByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getProductCategoryById(Number(id));
  res.status(200).json({
    message: "Product Category fetched successfully",
    data: result,
  });
};

const updateProductCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const productCategory = req.body;
  const result = await updateProductCategory(Number(id), productCategory);
  res.status(200).json({
    message: "Product Category updated successfully",
    data: result,
  });
};

const deleteProductCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteProductCategory(Number(id));
  res.status(200).json({
        message: "Product Category deleted successfully",
    data: result,
  });
};

export { createProductCategoryController, getAllProductCategoriesController, getProductCategoryByIdController, updateProductCategoryController, deleteProductCategoryController };