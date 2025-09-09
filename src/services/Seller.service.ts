import { db } from "../config/db";
import { sellers, users } from "../config/schema";
import { eq, and, asc } from "drizzle-orm";

const createSeller = async (seller: typeof sellers.$inferInsert) => {
  const [result] = await db.insert(sellers).values(seller).returning();
  
  return result;
};

const getAllSellers = async () => {
  const result = await db.select().from(sellers);
  return result;
};

const getSellerById = async (id: number) => {
  const result = await db.select().from(sellers).where(eq(sellers.id, id));
  return result;
};

const updateSeller = async (id: number, seller: typeof sellers.$inferInsert) => {
  const result = await db.update(sellers).set(seller).where(eq(sellers.id, id));
  return result;
};

const deleteSeller = async (id: number) => {
  const result = await db.delete(sellers).where(eq(sellers.id, id));
  return result;
};

const getSellersByProduct = async (productId: number) => {
  const result = await db
    .select({
      seller_id: sellers.id,
      user_id: sellers.user_id,
      username: users.username,
      avatar: users.avatar,
      price_original: sellers.price_original,
      discount: sellers.discount,
      stock: sellers.stock,
      status: sellers.status,
    })
    .from(sellers)
    .leftJoin(users, eq(sellers.user_id, users.id))
    .where(and(
      eq(sellers.product_id, productId),
      eq(sellers.status, true)
    ))
    .orderBy(asc(sellers.price_original));

  // Tính giá cuối cùng cho mỗi seller
  const sellersWithFinalPrice = result.map(seller => ({
    ...seller,
    final_price: seller.discount ? seller.price_original - seller.discount : seller.price_original
  }));

  return sellersWithFinalPrice;
};

export { createSeller, getAllSellers, getSellerById, getSellersByProduct, updateSeller, deleteSeller };