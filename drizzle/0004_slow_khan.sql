CREATE TABLE "platforms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"status" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"image_url" text NOT NULL,
	"status" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"variant_name" text NOT NULL,
	"variant_value" text NOT NULL,
	"status" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "sellers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"description" text,
	"rating" integer DEFAULT 0,
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"status" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"avatar" text,
	"created_at" timestamp DEFAULT now(),
	"status" boolean DEFAULT true,
	"role" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_categories" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "price_original" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "discount" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "seller_id" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "platform_id" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "stock" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_sellers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE no action ON UPDATE no action;