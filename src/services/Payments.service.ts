import { db } from "../config/db";
import { payment } from "../config/schema";
import { eq } from "drizzle-orm";

const createPayment = async (p: typeof payment.$inferInsert) => {
  const [result] = await db.insert(payment).values(p).returning();
  return result;
};

const getAllPayments = async () => {
  const result = await db.select().from(payment);
  return result;
};

const getPaymentById = async (id: number) => {
  const result = await db.select().from(payment).where(eq(payment.id, id));
  return result;
};

const updatePayment = async (id: number, p: typeof payment.$inferInsert) => {
  const result = await db.update(payment).set(p).where(eq(payment.id, id));
  return result;
};

const deletePayment = async (id: number) => {
  const result = await db.delete(payment).where(eq(payment.id, id));
  return result;
};

export { createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment }; 