import { db } from "../config/db";
import { carts } from "../config/schema";
import { eq } from "drizzle-orm";

const createCart = async (cart: typeof carts.$inferInsert) => {
  const [result] = await db.insert(carts).values(cart).returning();
  return result;
};

const getAllCarts = async () => {
  const result = await db.select().from(carts);
  return result;
};

const getCartById = async (id: number) => {
  const result = await db.select().from(carts).where(eq(carts.id, id));
  return result;
};

const updateCart = async (id: number, cart: typeof carts.$inferInsert) => {
  const result = await db.update(carts).set(cart).where(eq(carts.id, id));
  return result;
};

const deleteCart = async (id: number) => {
  const result = await db.delete(carts).where(eq(carts.id, id));
  return result;
};

export { createCart, getAllCarts, getCartById, updateCart, deleteCart }; 