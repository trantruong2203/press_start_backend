import { db } from "../config/db";
import { productImages, products } from "../config/schema";
import { eq } from "drizzle-orm";

const createProductImage = async (productImage: typeof productImages.$inferInsert) => {
  const [result] = await db.insert(productImages).values(productImage).returning();
  return result;
};

const getAllProductImages = async () => {
  const result = await db.select().from(productImages).leftJoin(products, eq(productImages.product_id, products.id));
  return result;
};

const getProductImageById = async (id: number) => {
  const result = await db.select().from(productImages).leftJoin(products, eq(productImages.product_id, products.id)).where(eq(productImages.id, id));
  return result;
};

const updateProductImage = async (id: number, productImage: typeof productImages.$inferInsert) => {
  const result = await db.update(productImages).set(productImage).where(eq(productImages.id, id));
  return result;
};

const deleteProductImage = async (id: number) => {
  const result = await db.delete(productImages).where(eq(productImages.id, id));
  return result;
};

export { createProductImage, getAllProductImages, getProductImageById, updateProductImage, deleteProductImage }; 