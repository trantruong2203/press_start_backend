import { db } from "../config/db";
import { productCategories } from "../config/schema";
import { eq } from "drizzle-orm";

const createProductCategory = async (productCategory: typeof productCategories.$inferInsert) => {
  const [result] = await db.insert(productCategories).values(productCategory).returning();
  return result;
};

const getAllProductCategories = async () => {
  const result = await db.select().from(productCategories);
  return result;
};

const getProductCategoryById = async (id: number) => {
  const result = await db.select().from(productCategories).where(eq(productCategories.id, id));
  return result;
};

const updateProductCategory = async (id: number, productCategory: typeof productCategories.$inferInsert) => {
  const result = await db.update(productCategories).set(productCategory).where(eq(productCategories.id, id));
  return result;
};

const deleteProductCategory = async (id: number) => {
  const result = await db.delete(productCategories).where(eq(productCategories.id, id));
  return result;
};

export { createProductCategory, getAllProductCategories, getProductCategoryById, updateProductCategory, deleteProductCategory };