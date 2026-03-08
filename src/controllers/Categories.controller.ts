import { Request, Response } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../services/Categories.service";
import { catchAsync } from "../utils/catchAsync";
import { ApiError } from "../utils/ApiError";

const createCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const category = req.body;
    const result = await createCategory(category);
    res.status(201).json({
      message: "Category created successfully",
      data: result,
    });
  },
);

const getAllCategoriesController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getAllCategories();
    res.status(200).json({
      message: "Categories fetched successfully",
      data: result,
    });
  },
);

const getCategoryByIdController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await getCategoryById(Number(id));
    if (!result) {
      throw new ApiError(404, "Category not found");
    }
    res.status(200).json({
      message: "Category fetched successfully",
      data: result,
    });
  },
);

const updateCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = req.body;
    const result = await updateCategory(Number(id), category);
    if (!result) {
      throw new ApiError(404, "Category not found");
    }
    res.status(200).json({
      message: "Category updated successfully",
      data: result,
    });
  },
);

const deleteCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteCategory(Number(id));
    res.status(200).json({
      message: "Category deleted successfully",
      data: result,
    });
  },
);

export {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
};
