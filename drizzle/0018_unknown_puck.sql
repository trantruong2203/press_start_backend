ALTER TABLE "orders" DROP CONSTRAINT "orders_voucher_id_vouchers_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "order_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "sub_total";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "voucher_id";