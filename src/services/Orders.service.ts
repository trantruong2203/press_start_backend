import { db } from "../config/db";
import { orders } from "../config/schema";
import { eq } from "drizzle-orm";

const createOrder = async (order: typeof orders.$inferInsert) => {
  const [result] = await db.insert(orders).values(order).returning();
  return result;
};

const getAllOrders = async () => {
  const result = await db.select().from(orders);
  return result;
};

const getOrderById = async (id: number) => {
  const result = await db.select().from(orders).where(eq(orders.id, id));
  return result;
};

const updateOrder = async (id: number, order: typeof orders.$inferInsert) => {
  const result = await db.update(orders).set(order).where(eq(orders.id, id));
  return result;
};

const deleteOrder = async (id: number) => {
  const result = await db.delete(orders).where(eq(orders.id, id));
  return result;
};

const getOrderByOrderCode = async (orderCode: string) => {
  const result = await db.select().from(orders).where(eq(orders.order_code, orderCode));
  return result[0];
};

export { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, getOrderByOrderCode }; 