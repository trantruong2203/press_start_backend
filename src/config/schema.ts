import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  platform_id: integer("platform_id").references(() => platforms.id).notNull(),
  banner_url: text("banner_url"),
  trailer_url: text("trailer_url"),
  status: boolean("status").default(true),
  author: text("author"),
  created_at: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: boolean("status").default(true),
});

export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  product_id: integer("product_id").references(() => products.id).notNull(),
  category_id: integer("category_id").references(() => categories.id).notNull(),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  product_id: integer("product_id").references(() => products.id).notNull(),
  img_url: text("img_url").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  avatar: text("avatar"),
  created_at: timestamp("created_at").defaultNow(),
  status: boolean("status").default(true),
  role: text("role").notNull().default("user"),
});

export const sellers = pgTable("sellers", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  product_id: integer("product_id").references(() => products.id).notNull(),
  price_original: integer("price_original").notNull(),
  discount: integer("discount"),
  status: boolean("status").default(true),
  stock: integer("stock").notNull(),
});

export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  product_id: integer("product_id").references(() => products.id).notNull(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  created_at: timestamp("created_at").defaultNow(),
  status: boolean("status").default(true),
});

export const platforms = pgTable("platforms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: boolean("status").default(true),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  product_id: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const vouchers = pgTable("vouchers", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  discount: integer("discount").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  buyer_id: integer("buyer_id").references(() => users.id),
  seller_id: integer("seller_id").references(() => sellers.id),
  sub_total: integer("sub_total").notNull(),
  voucher_id: integer("voucher_id").references(() => vouchers.id),
  total: integer("total").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  paid_at: timestamp("paid_at"),
  status: text("status").notNull().default("pending"),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id").references(() => orders.id),
  product_id: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const post = pgTable("post", {
  id: serial("id").primaryKey(),
  author_id: integer("author_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  status: text("status").notNull().default("pending"),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  post_id: integer("post_id").references(() => post.id),
  sender_id: integer("sender_id").references(() => users.id),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  status: text("status").notNull().default("active"),
  reply_to_id: integer("reply_to_id") ,
});

export const payment = pgTable("payment", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(),
  trans_code: text("trans_code").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull().default("pending"),
  paid_at: timestamp("paid_at"),
});

export const accountpool = pgTable("account_pool", {
  id: serial("id").primaryKey(),
  product_id: integer("product_id").references(() => products.id),
  order_item_id: integer("order_item_id").references(() => orderItems.id),
  username: text("username").notNull(),
  password: text("password").notNull(),
  delivered: boolean("delivered").default(false),
  created_at: timestamp("created_at").defaultNow(),
  status: text("status").notNull().default("pending"),
});

export const keypool = pgTable("keypool", {
  id: serial("id").primaryKey(),
  product_id: integer("product_id").references(() => products.id),
  order_item_id: integer("order_item_id").references(() => orderItems.id),
  key_code: text("key_code").notNull(),
  delivered: boolean("delivered").default(false),
  created_at: timestamp("created_at").defaultNow(),
  status: text("status").notNull().default("pending"),
});

export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  product_id: integer("product_id").references(() => products.id),
  created_at: timestamp("created_at").defaultNow(),
  status: text("status").notNull().default("active"),
});
