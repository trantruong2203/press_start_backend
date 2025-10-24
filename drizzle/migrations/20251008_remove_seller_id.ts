import { sql } from "drizzle-orm";

export const up = sql`
  ALTER TABLE "orders"
  DROP COLUMN IF EXISTS "seller_id";
`;

export const down = sql`
  ALTER TABLE "orders"
  ADD COLUMN "seller_id" integer REFERENCES "sellers"("id");
`;
