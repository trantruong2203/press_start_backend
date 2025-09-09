import { db } from "../config/db";
import { vouchers } from "../config/schema";
import { eq } from "drizzle-orm";

const createVoucher = async (voucher: typeof vouchers.$inferInsert) => {
  const [result] = await db.insert(vouchers).values(voucher).returning();
  return result;
};

const getAllVouchers = async () => {
  const result = await db.select().from(vouchers);
  return result;
};

const getVoucherById = async (id: number) => {
  const result = await db.select().from(vouchers).where(eq(vouchers.id, id));
  return result;
};

const updateVoucher = async (id: number, voucher: typeof vouchers.$inferInsert) => {
  const result = await db.update(vouchers).set(voucher).where(eq(vouchers.id, id));
  return result;
};

const deleteVoucher = async (id: number) => {
  const result = await db.delete(vouchers).where(eq(vouchers.id, id));
  return result;
};

export { createVoucher, getAllVouchers, getVoucherById, updateVoucher, deleteVoucher }; 