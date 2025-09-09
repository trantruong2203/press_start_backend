CREATE TABLE "ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now(),
	"status" boolean DEFAULT true
);
--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "seller_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "sellers" RENAME COLUMN "rating" TO "rating_id";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_seller_id_sellers_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "platform_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "platform_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_rating_id_ratings_id_fk" FOREIGN KEY ("rating_id") REFERENCES "public"."ratings"("id") ON DELETE no action ON UPDATE no action;