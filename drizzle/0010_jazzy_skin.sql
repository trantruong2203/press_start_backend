ALTER TABLE "roles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "roles" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_role_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';