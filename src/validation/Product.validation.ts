import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Tên sản phẩm là bắt buộc" }),
    description: z.string().optional(),
    platform_id: z.number({ required_error: "Platform ID là bắt buộc" }),
    banner_url: z
      .string()
      .url("Banner URL không hợp lệ")
      .optional()
      .or(z.literal("")),
    trailer_url: z
      .string()
      .url("Trailer URL không hợp lệ")
      .optional()
      .or(z.literal("")),
    author: z.string().optional(),
    listCate: z
      .array(
        z.object({
          id: z.number(),
        }),
      )
      .min(1, "Phải chọn ít nhất một danh mục"),
    listImg: z
      .array(z.string().url("Image URL không hợp lệ"))
      .min(1, "Phải có ít nhất một hình ảnh"),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID phải là số"),
  }),
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    platform_id: z.number().optional(),
    banner_url: z
      .string()
      .url("Banner URL không hợp lệ")
      .optional()
      .or(z.literal("")),
    trailer_url: z
      .string()
      .url("Trailer URL không hợp lệ")
      .optional()
      .or(z.literal("")),
    author: z.string().optional(),
    listCate: z
      .array(
        z.object({
          id: z.number(),
        }),
      )
      .optional(),
    listImg: z.array(z.string().url("Image URL không hợp lệ")).optional(),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID phải là số"),
  }),
});
