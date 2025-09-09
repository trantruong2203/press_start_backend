ALTER TABLE "roles" DROP CONSTRAINT "roles_name_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_role_roles_name_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_roles_id_fk" FOREIGN KEY ("role") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");