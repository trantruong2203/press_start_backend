import { db } from "../config/db";
import { comments } from "../config/schema";
import { eq } from "drizzle-orm";

const createComment = async (c: typeof comments.$inferInsert) => {
  const [result] = await db.insert(comments).values(c).returning();
  return result;
};

const getAllComments = async () => {
  const result = await db.select().from(comments);
  return result;
};

const getCommentById = async (id: number) => {
  const result = await db.select().from(comments).where(eq(comments.id, id));
  return result;
};

const updateComment = async (id: number, c: typeof comments.$inferInsert) => {
  const result = await db.update(comments).set(c).where(eq(comments.id, id));
  return result;
};

const deleteComment = async (id: number) => {
  const result = await db.delete(comments).where(eq(comments.id, id));
  return result;
};

export { createComment, getAllComments, getCommentById, updateComment, deleteComment }; 