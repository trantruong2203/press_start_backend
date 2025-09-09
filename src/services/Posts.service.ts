import { db } from "../config/db";
import { post } from "../config/schema";
import { eq } from "drizzle-orm";

const createPost = async (p: typeof post.$inferInsert) => {
  const [result] = await db.insert(post).values(p).returning();
  return result;
};

const getAllPosts = async () => {
  const result = await db.select().from(post);
  return result;
};

const getPostById = async (id: number) => {
  const result = await db.select().from(post).where(eq(post.id, id));
  return result;
};

const updatePost = async (id: number, p: typeof post.$inferInsert) => {
  const result = await db.update(post).set(p).where(eq(post.id, id));
  return result;
};

const deletePost = async (id: number) => {
  const result = await db.delete(post).where(eq(post.id, id));
  return result;
};

export { createPost, getAllPosts, getPostById, updatePost, deletePost }; 