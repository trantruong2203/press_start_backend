ALTER TABLE "orders" ADD COLUMN "sub_total" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "voucher_id" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "order_code";