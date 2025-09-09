ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "categories" CASCADE;--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "category_id";