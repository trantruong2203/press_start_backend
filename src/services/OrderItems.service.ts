import { db } from "../config/db";
import { orderItems } from "../config/schema";
import { eq } from "drizzle-orm";

const createOrderItem = async (item: typeof orderItems.$inferInsert) => {
  const [result] = await db.insert(orderItems).values(item).returning();
  return result;
};

const getAllOrderItems = async () => {
  const result = await db.select().from(orderItems);
  return result;
};

const getOrderItemById = async (id: number) => {
  const result = await db.select().from(orderItems).where(eq(orderItems.id, id));
  return result;
};

const updateOrderItem = async (id: number, item: typeof orderItems.$inferInsert) => {
  const result = await db.update(orderItems).set(item).where(eq(orderItems.id, id));
  return result;
};

const deleteOrderItem = async (id: number) => {
  const result = await db.delete(orderItems).where(eq(orderItems.id, id));
  return result;
};

export { createOrderItem, getAllOrderItems, getOrderItemById, updateOrderItem, deleteOrderItem }; 