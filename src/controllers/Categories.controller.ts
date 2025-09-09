import { Request, Response } from "express";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../services/Categories.service";

const createCategoryController = async (req: Request, res: Response) => {
  const category = req.body;
  const result = await createCategory(category);
  res.status(201).json({
    message: "Category created successfully",
    data: result,
  });
};

const getAllCategoriesController = async (req: Request, res: Response) => {
  const result = await getAllCategories();
  res.status(200).json({
    message: "Categories fetched successfully",
    data: result,
  });
};

const getCategoryByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getCategoryById(Number(id));
  res.status(200).json({
    message: "Category fetched successfully",
    data: result,
  });
};

const updateCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = req.body;
  const result = await updateCategory(Number(id), category);
  res.status(200).json({
    message: "Category updated successfully",
    data: result,
  });
};

const deleteCategoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteCategory(Number(id));
  res.status(200).json({
    message: "Category deleted successfully",
    data: result,
  });
};

export { createCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController, deleteCategoryController };