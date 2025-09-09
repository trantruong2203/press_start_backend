// middlewares/auth.middleware.ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { email: string; id?: number; role?: string };
    }
  }
}

const SECRET = process.env.SECRET || 'secret';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
   
  if (!token) {
    return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload & { email: string; id?: number };
    
    if (!decoded.email) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
    
    req.user = {
      email: decoded.email,
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};