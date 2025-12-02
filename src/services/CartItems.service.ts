import { db } from "../config/db";
import { cartItems } from "../config/schema";
import { eq, and } from "drizzle-orm";

// CREATE
const createCartItem = async (item: typeof cartItems.$inferInsert) => {
  const [result] = await db.insert(cartItems).values(item).returning();
  return result;
};

// GET ALL BY USER
const getAllCartItems = async (userId: number) => {
  const result = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.user_id, userId));

  return result;
};

// GET ONE BY ID + USER (an toàn hơn)
const getCartItemById = async (id: number, userId: number) => {
  const [result] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.id, id), eq(cartItems.user_id, userId)));

  return result;
};

// UPDATE
const updateCartItem = async (
  id: number,
  userId: number,
  item: Partial<typeof cartItems.$inferInsert>
) => {
  const result = await db
    .update(cartItems)
    .set(item)
    .where(and(eq(cartItems.id, id), eq(cartItems.user_id, userId)))
    .returning();

  return result[0] ?? null;
};

// DELETE
const deleteCartItem = async (cartItemsId: number, userId: number) => {
  const result = await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, cartItemsId), eq(cartItems.user_id, userId)));

  return result.rowCount > 0;
};

export {
  createCartItem,
  getAllCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
};
