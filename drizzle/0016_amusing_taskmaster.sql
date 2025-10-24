ALTER TABLE "orders" DROP CONSTRAINT "orders_seller_id_sellers_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_voucher_id_vouchers_id_fk";
--> statement-breakpoint
ALTER TABLE "account_pool" ALTER COLUMN "status" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "account_pool" ALTER COLUMN "status" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "account_pool" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "status" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "status" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "keypool" ALTER COLUMN "status" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "keypool" ALTER COLUMN "status" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "keypool" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payment" ALTER COLUMN "status" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "payment" ALTER COLUMN "status" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "payment" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "status" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "status" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "wishlist" ALTER COLUMN "status" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "wishlist" ALTER COLUMN "status" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "wishlist" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "order_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "seller_id";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "sub_total";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "voucher_id";