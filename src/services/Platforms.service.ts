import { db } from "../config/db";
import { platforms } from "../config/schema";
import { eq } from "drizzle-orm";

const createPlatform = async (platform: typeof platforms.$inferInsert) => {
  const [result] = await db.insert(platforms).values(platform).returning();
  return result;
};

const getAllPlatforms = async () => {
  const result = await db.select().from(platforms);
  return result;
};

const getPlatformById = async (id: number) => {
  const result = await db.select().from(platforms).where(eq(platforms.id, id));
  return result;
};

const updatePlatform = async (id: number, platform: typeof platforms.$inferInsert) => {
  const result = await db.update(platforms).set(platform).where(eq(platforms.id, id));
  return result;
};

const deletePlatform = async (id: number) => {
  const result = await db.delete(platforms).where(eq(platforms.id, id));
  return result;
};

export { createPlatform, getAllPlatforms, getPlatformById, updatePlatform, deletePlatform }; 