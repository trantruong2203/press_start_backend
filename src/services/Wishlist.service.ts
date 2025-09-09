import { db } from "../config/db";
import { wishlist } from "../config/schema";
import { eq } from "drizzle-orm";

const createWishlist = async (w: typeof wishlist.$inferInsert) => {
  const [result] = await db.insert(wishlist).values(w).returning();
  return result;
};

const getAllWishlist = async () => {
  const result = await db.select().from(wishlist);
  return result;
};

const getWishlistById = async (id: number) => {
  const result = await db.select().from(wishlist).where(eq(wishlist.id, id));
  return result;
};

const updateWishlist = async (id: number, w: typeof wishlist.$inferInsert) => {
  const result = await db.update(wishlist).set(w).where(eq(wishlist.id, id));
  return result;
};

const deleteWishlist = async (id: number) => {
  const result = await db.delete(wishlist).where(eq(wishlist.id, id));
  return result;
};

export { createWishlist, getAllWishlist, getWishlistById, updateWishlist, deleteWishlist }; 