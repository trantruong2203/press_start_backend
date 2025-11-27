import { db } from "../config/db";
import { users } from "../config/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const SECRET = process.env.SECRET;

if (!SECRET) {
  console.warn("WARNING: SECRET environment variable is not set. JWT signing will fail or be insecure.");
}

const getAllUsers = async () => {
  const result = await db.select().from(users);
  return result;
};

const getUserByEmail = async (email: string) => {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result;
};

const login = async (email: string, password: string) => {
  try {
    const results = await getUserByEmail(email);
     
    if (results.length === 0) {
      throw { status: 401, message: 'Email không tồn tại' };
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      throw { status: 401, message: 'Sai mật khẩu' };
    }
    
    if (!SECRET) {
        throw { status: 500, message: 'Server configuration error: SECRET missing' };
    }

    const token = jwt.sign({ email: user.email, role: user.role }, SECRET, { expiresIn: '2h' });
    return { token };
  } catch (err: any) {
    if (err.status) throw err;
    throw { status: 500, message: 'Lỗi truy vấn', error: err };
  }
};

const createUser = async (username: string, password: string, email: string) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser.length > 0) {
      throw { status: 400, message: 'Email đã tồn tại, vui lòng sử dụng email khác' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
      
    const result = await db.insert(users).values({
      username: username,
      password: hashedPassword,
      email: email,
      created_at: new Date(),
      status: true,
      role: 'user'
    })
    .returning();
    
    return result;
  } catch (err: any) {
    if (err.status) throw err;
    if (err.code === 'ER_DUP_ENTRY' || err.code === '23505') {
      throw { status: 400, message: 'Email đã tồn tại, vui lòng sử dụng email khác' };
    }
    throw { status: 500, message: 'Lỗi server khi tạo tài khoản', error: err };
  }
};

const updateUser = async (email: string, phone: string, avatar: string ) => {
  const result = await db.update(users).set({ phone, avatar }).where(eq(users.email, email));
  return result;
};

const deleteUser = async (id: number) => {
  const result = await db.delete(users).where(eq(users.id, id));
  return result;
};

export { createUser, getAllUsers, getUserByEmail, updateUser, deleteUser, login };