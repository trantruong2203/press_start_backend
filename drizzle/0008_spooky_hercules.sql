ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;