import { db } from "../config/db";
import { keypool } from "../config/schema";
import { eq } from "drizzle-orm";

const createKeyPool = async (k: typeof keypool.$inferInsert) => {
  const [result] = await db.insert(keypool).values(k).returning();
  return result;
};

const getAllKeyPool = async () => {
  const result = await db.select().from(keypool);
  return result;
};

const getKeyPoolById = async (id: number) => {
  const result = await db.select().from(keypool).where(eq(keypool.id, id));
  return result;
};

const updateKeyPool = async (id: number, k: typeof keypool.$inferInsert) => {
  const result = await db.update(keypool).set(k).where(eq(keypool.id, id));
  return result;
};

const deleteKeyPool = async (id: number) => {
  const result = await db.delete(keypool).where(eq(keypool.id, id));
  return result;
};

export { createKeyPool, getAllKeyPool, getKeyPoolById, updateKeyPool, deleteKeyPool }; 