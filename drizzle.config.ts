/// <reference types="node" />
import 'dotenv/config';
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/config/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!, 
  },
});