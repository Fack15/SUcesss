import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Please provide your Supabase database connection string from your Supabase dashboard."
  );
}

const client = postgres(databaseUrl);
export const db = drizzle(client, { schema });