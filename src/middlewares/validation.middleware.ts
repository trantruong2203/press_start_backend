import type { RequestHandler } from "express";
import type { AnySchema, ObjectSchema, ValidationOptions } from "joi";

type RequestSegment = "body" | "params" | "query";

type SchemaConfig = Partial<Record<RequestSegment, ObjectSchema | AnySchema>>;

const defaultOptions: ValidationOptions = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: true,
};

export const validateRequest = (
  schemas: SchemaConfig,
  options?: ValidationOptions,
): RequestHandler => {
  const validationOptions = { ...defaultOptions, ...options };

  return (req, res, next) => {
    for (const segment of ["params", "query", "body"] as RequestSegment[]) {
      const schema = schemas[segment];
      if (!schema) continue;

      const { error, value } = schema.validate(
        (req as any)[segment],
        validationOptions,
      );

      if (error) {
        return res.status(400).json({
          message: "Dữ liệu không hợp lệ",
          details: error.details.map((detail) => detail.message),
        });
      }

      (req as any)[segment] = value;
    }

    return next();
  };
};


