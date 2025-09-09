ALTER TABLE "products" DROP CONSTRAINT "products_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "user_id";