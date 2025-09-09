import { db } from "../config/db";
import { accountpool } from "../config/schema";
import { eq } from "drizzle-orm";

const createAccountPool = async (acc: typeof accountpool.$inferInsert) => {
  const [result] = await db.insert(accountpool).values(acc).returning();
  return result;
};

const getAllAccountPool = async () => {
  const result = await db.select().from(accountpool);
  return result;
};

const getAccountPoolById = async (id: number) => {
  const result = await db.select().from(accountpool).where(eq(accountpool.id, id));
  return result;
};

const updateAccountPool = async (id: number, acc: typeof accountpool.$inferInsert) => {
  const result = await db.update(accountpool).set(acc).where(eq(accountpool.id, id));
  return result;
};

const deleteAccountPool = async (id: number) => {
  const result = await db.delete(accountpool).where(eq(accountpool.id, id));
  return result;
};

export { createAccountPool, getAllAccountPool, getAccountPoolById, updateAccountPool, deleteAccountPool }; 