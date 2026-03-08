import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError, ZodIssue } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors
          .map((details: ZodIssue) => details.message)
          .join(", ");
        return next(new ApiError(400, errorMessage));
      }
      next(error);
    }
  };
