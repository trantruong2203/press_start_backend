import { db } from "../config/db";
import { cartItems } from "../config/schema";
import { eq } from "drizzle-orm";

const createCartItem = async (item: typeof cartItems.$inferInsert) => {
  const [result] = await db.insert(cartItems).values(item).returning();
  return result;
};

const getAllCartItems = async () => {
  const result = await db.select().from(cartItems);
  return result;
};

const getCartItemById = async (id: number) => {
  const result = await db.select().from(cartItems).where(eq(cartItems.id, id));
  return result;
};

const updateCartItem = async (id: number, item: typeof cartItems.$inferInsert) => {
  const result = await db.update(cartItems).set(item).where(eq(cartItems.id, id));
  return result;
};

const deleteCartItem = async (id: number) => {
  const result = await db.delete(cartItems).where(eq(cartItems.id, id));
  return result;
};

// Xóa toàn bộ giỏ hàng theo user_id
const deleteCartItemsByUserId = async (userId: number) => {
  const result = await db.delete(cartItems).where(eq(cartItems.user_id, userId));
  return result;
};

export { createCartItem, getAllCartItems, getCartItemById, updateCartItem, deleteCartItem, deleteCartItemsByUserId }; 