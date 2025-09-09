import { db } from "../config/db";
import { users } from "../config/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";



const SECRET = process.env.SECRET;



const getAllUsers = async () => {
  const result = await db.select().from(users);
  return result;
};

const getUserByEmail = async (email: string) => {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result;
};

const login = (email: string, password: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("email", email);
      console.log("password", password);
      const results = await getUserByEmail(email);
      console.log("results", results);
     
      if (results.length === 0) return reject({ status: 401, message: 'email không tồn tại' });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return reject({ status: 401, message: 'Sai mật khẩu' });
      // Tạo token JWT với thời gian hết hạn là 2 giờ
      const token = jwt.sign({ email: user.email, role: user.role }, SECRET || '', { expiresIn: '2h' });
      console.log("token", token);   
      resolve({ token });
    } catch (err) {
      reject({ status: 500, message: 'Lỗi truy vấn', error: err });
    }
  });
};

const createUser = async (username: string, password: string, email: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Mã hóa mật khẩu trước khi lưu vào database
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
      resolve({ message: 'Đăng ký thành công', user: result[0] || null });
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY' || err.code === '23505') {
        return reject({ status: 400, message: 'email đã tồn tại' });
      }
      return reject({ status: 500, message: 'Lỗi server khi tạo tài khoản', error: err });
    }
  });
};

const updateUser = async (email: string, phone: string, avatar: string) => {
  const result = await db.update(users).set({ phone, avatar }).where(eq(users.email, email));
  return result;
};

const deleteUser = async (id: number) => {
  const result = await db.delete(users).where(eq(users.id, id));
  return result;
};


export { createUser, getAllUsers, getUserByEmail, updateUser, deleteUser, login };