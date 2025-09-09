ALTER TABLE "carts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "product_images" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "carts" CASCADE;--> statement-breakpoint
DROP TABLE "product_images" CASCADE;--> statement-breakpoint
ALTER TABLE "cart_items" RENAME COLUMN "cart_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_cart_id_carts_id_fk";
--> statement-breakpoint
ALTER TABLE "sellers" DROP CONSTRAINT "sellers_rating_id_ratings_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "banner_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "trailer_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "author" text;--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "product_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "price_original" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "discount" integer;--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "stock" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "price_original";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "discount";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "stock";--> statement-breakpoint
ALTER TABLE "sellers" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "sellers" DROP COLUMN "bio";--> statement-breakpoint
ALTER TABLE "sellers" DROP COLUMN "rating_id";--> statement-breakpoint
ALTER TABLE "sellers" DROP COLUMN "verified";--> statement-breakpoint
ALTER TABLE "sellers" DROP COLUMN "created_at";