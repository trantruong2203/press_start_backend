import Joi from "joi";

const positiveInt = () => Joi.number().integer().positive();
const nullableString = () => Joi.string().allow(null, "").trim();

export const idParamSchema = Joi.object({
  id: positiveInt().required(),
});

export const emailParamSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const orderCodeParamSchema = Joi.object({
  orderCode: Joi.string().trim().required(),
});

export const productIdParamSchema = Joi.object({
  productId: positiveInt().required(),
});

export const categoryBase = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().trim(),
  status: Joi.boolean(),
});

export const categoryCreateSchema = categoryBase.fork(
  ["name", "description"],
  (schema) => schema.required(),
);

export const categoryUpdateSchema = categoryBase.min(1);

const accountPoolBase = Joi.object({
  product_id: positiveInt(),
  order_item_id: positiveInt(),
  username: Joi.string().trim(),
  password: Joi.string().trim(),
  delivered: Joi.boolean(),
  status: Joi.boolean(),
});

export const accountPoolCreateSchema = accountPoolBase.fork(
  ["username", "password"],
  (schema) => schema.min(3).required(),
);

export const accountPoolUpdateSchema = accountPoolBase.min(1);

const cartItemBase = Joi.object({
  user_id: positiveInt().allow(null),
  email: Joi.string().email(),
  product_id: positiveInt().allow(null),
  quantity: positiveInt(),
});

export const cartItemCreateSchema = cartItemBase.fork(
  ["email", "quantity"],
  (schema) => schema.required(),
);

export const cartItemUpdateSchema = cartItemBase.min(1);

const commentBase = Joi.object({
  post_id: positiveInt(),
  sender_id: positiveInt(),
  content: Joi.string().trim(),
  reply_to_id: positiveInt(),
  status: Joi.boolean(),
});

export const commentCreateSchema = commentBase.fork(
  ["post_id", "sender_id", "content"],
  (schema) => schema.required(),
);

export const commentUpdateSchema = commentBase.min(1);

const keyPoolBase = Joi.object({
  product_id: positiveInt(),
  order_item_id: positiveInt(),
  key_code: Joi.string().trim(),
  delivered: Joi.boolean(),
  status: Joi.boolean(),
});

export const keyPoolCreateSchema = keyPoolBase.fork(
  ["key_code"],
  (schema) => schema.required(),
);

export const keyPoolUpdateSchema = keyPoolBase.min(1);

const orderItemBase = Joi.object({
  order_id: positiveInt(),
  product_id: positiveInt(),
  quantity: positiveInt(),
  price: positiveInt(),
});

export const orderItemCreateSchema = orderItemBase.fork(
  ["order_id", "product_id", "quantity", "price"],
  (schema) => schema.required(),
);

export const orderItemUpdateSchema = orderItemBase.min(1);

const orderBase = Joi.object({
  buyer_id: positiveInt(),
  order_code: Joi.string().trim(),
  total: positiveInt(),
  paid_at: Joi.date().iso(),
  status: Joi.boolean(),
});

export const orderCreateSchema = orderBase.fork(
  ["order_code", "total"],
  (schema) => schema.required(),
);

export const orderUpdateSchema = orderBase.min(1);

const paymentBase = Joi.object({
  provider: Joi.string().trim(),
  trans_code: Joi.string().trim(),
  amount: positiveInt(),
  currency: Joi.string().trim(),
  status: Joi.boolean(),
  paid_at: Joi.date().iso(),
});

export const paymentCreateSchema = paymentBase.fork(
  ["provider", "trans_code", "amount", "currency"],
  (schema) => schema.required(),
);

export const paymentUpdateSchema = paymentBase.min(1);

const platformBase = Joi.object({
  name: Joi.string().trim(),
  status: Joi.boolean(),
});

export const platformCreateSchema = platformBase.fork(
  ["name"],
  (schema) => schema.required(),
);

export const platformUpdateSchema = platformBase.min(1);

const postBase = Joi.object({
  author_id: positiveInt(),
  title: Joi.string().trim(),
  content: Joi.string().trim(),
  status: Joi.boolean(),
});

export const postCreateSchema = postBase.fork(
  ["title", "content"],
  (schema) => schema.required(),
);

export const postUpdateSchema = postBase.min(1);

const productCategoryBase = Joi.object({
  product_id: positiveInt(),
  category_id: positiveInt(),
});

export const productCategoryCreateSchema = productCategoryBase.fork(
  ["product_id", "category_id"],
  (schema) => schema.required(),
);

export const productCategoryUpdateSchema = productCategoryBase.min(1);

const productImageBase = Joi.object({
  product_id: positiveInt(),
  img_url: Joi.string().trim(),
});

export const productImageCreateSchema = productImageBase.fork(
  ["product_id", "img_url"],
  (schema) => schema.required(),
);

export const productImageUpdateSchema = productImageBase.min(1);

const categoryRefSchema = Joi.object({
  id: positiveInt().required(),
  name: Joi.string().trim().allow(null, ""),
  description: Joi.string().trim().allow(null, ""),
  status: Joi.boolean(),
});

const productBase = Joi.object({
  name: Joi.string().trim(),
  description: nullableString(),
  platform_id: positiveInt(),
  banner_url: nullableString(),
  trailer_url: nullableString(),
  status: Joi.boolean(),
  author: Joi.alternatives(Joi.string().trim(), positiveInt()).allow(null, ""),
  listCate: Joi.array().items(categoryRefSchema).min(0),
  listImg: Joi.array().items(Joi.string().trim()).min(0),
});

export const productCreateSchema = productBase.fork(
  ["name", "platform_id"],
  (schema) => schema.required(),
).fork(["listCate"], (schema) => schema.min(1).required());

export const productUpdateSchema = productBase.min(1);

const sellerBase = Joi.object({
  user_id: positiveInt(),
  product_id: positiveInt(),
  price_original: positiveInt(),
  discount: Joi.number().integer().min(0),
  stock: Joi.number().integer().min(0),
  status: Joi.boolean(),
});

export const sellerCreateSchema = sellerBase.fork(
  ["user_id", "product_id", "price_original", "stock"],
  (schema) => schema.required(),
);

export const sellerUpdateSchema = sellerBase.min(1);

const userBase = Joi.object({
  username: Joi.string().trim(),
  password: Joi.string().min(6),
  email: Joi.string().email(),
  phone: Joi.string().trim(),
  avatar: Joi.string().trim(),
  status: Joi.boolean(),
  role: Joi.string().trim(),
});

export const userCreateSchema = userBase.fork(
  ["username", "password", "email"],
  (schema) => schema.required(),
);

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const userUpdateSchema = Joi.object({
  phone: Joi.string().trim().allow("", null),
  avatar: Joi.string().trim().allow("", null),
}).min(1);

export const wishlistBase = Joi.object({
  user_id: positiveInt(),
  product_id: positiveInt(),
  status: Joi.boolean(),
});

export const wishlistCreateSchema = wishlistBase.fork(
  ["user_id", "product_id"],
  (schema) => schema.required(),
);

export const wishlistUpdateSchema = wishlistBase.min(1);

const voucherBase = Joi.object({
  code: Joi.string().trim(),
  discount: positiveInt(),
});

export const voucherCreateSchema = voucherBase.fork(
  ["code", "discount"],
  (schema) => schema.required(),
);

export const voucherUpdateSchema = voucherBase.min(1);

export const payOsCheckoutSchema = Joi.object({
  orderCode: Joi.alternatives(positiveInt(), Joi.string().trim().pattern(/^\d+$/))
    .required(),
  amount: positiveInt().required(),
  description: Joi.string().trim().max(25).required(),
  returnUrl: Joi.string().uri().required(),
  cancelUrl: Joi.string().uri().required(),
});

export const payOsTestOrderItemsSchema = Joi.object({
  orderId: positiveInt().required(),
  userId: positiveInt().required(),
});

export const payOsTestWebhookSchema = Joi.object({
  orderCode: Joi.string().trim().required(),
  status: Joi.string().trim().default("PAID"),
  amount: positiveInt().default(100000),
});


