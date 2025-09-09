ALTER TABLE "product_variants" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "product_variants" CASCADE;--> statement-breakpoint
ALTER TABLE "sellers" RENAME COLUMN "description" TO "bio";--> statement-breakpoint
ALTER TABLE "product_categories" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_categories" ALTER COLUMN "category_id" SET NOT NULL;