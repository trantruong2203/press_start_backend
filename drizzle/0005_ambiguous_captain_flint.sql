ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_roles_name_fk" FOREIGN KEY ("role") REFERENCES "public"."roles"("name") ON DELETE no action ON UPDATE no action;