// middlewares/auth.middleware.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

declare global {
  namespace Express {
    interface Request {
      user?: { email: string; id?: number; role?: string };
    }
  }
}

const SECRET = process.env.SECRET || "secret";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError(401, "Bạn chưa đăng nhập");
  }

  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload & {
      email: string;
      id?: number;
      role?: string;
    };

    if (!decoded.email) {
      throw new ApiError(401, "Token không hợp lệ");
    }

    req.user = {
      email: decoded.email,
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    next(new ApiError(401, "Token không hợp lệ hoặc đã hết hạn"));
  }
};

export const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      throw new ApiError(401, "Bạn không có quyền truy cập");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Bạn không có quyền thực hiện hành động này");
    }

    next();
  };
};
