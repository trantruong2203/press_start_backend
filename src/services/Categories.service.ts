import { db } from "../config/db";
import { categories } from "../config/schema";
import { eq } from "drizzle-orm";

const createCategory = async (category: typeof categories.$inferInsert) => {
  const [result] = await db.insert(categories).values(category).returning();
  return result;
};

const getAllCategories = async () => {
  const result = await db.select().from(categories);
  return result;
};

const getCategoryById = async (id: number) => {
  const result = await db.select().from(categories).where(eq(categories.id, id));
  return result;
};

const updateCategory = async (id: number, category: typeof categories.$inferInsert) => {
  const result = await db.update(categories).set(category).where(eq(categories.id, id));
  return result;
};

const deleteCategory = async (id: number) => {
  const result = await db.delete(categories).where(eq(categories.id, id));
  return result;
};


export { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };