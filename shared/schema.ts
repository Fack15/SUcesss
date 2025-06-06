import { pgTable, text, serial, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  username: text("username").unique(),
  password: text("password"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  netVolume: text("net_volume").notNull(),
  vintage: text("vintage").notNull(),
  type: text("type").notNull(),
  sugarContent: text("sugar_content").notNull(),
  appellation: text("appellation").notNull(),
  sku: text("sku").notNull(),
  alcohol: text("alcohol").notNull(),
  country: text("country").notNull(),
  ean: text("ean").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const ingredients = pgTable("ingredients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  eNumber: text("e_number").notNull(),
  allergens: text("allergens").array(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Product schemas
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateProductSchema = insertProductSchema.partial();

// Ingredient schemas
export const insertIngredientSchema = createInsertSchema(ingredients).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateIngredientSchema = insertIngredientSchema.partial();

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;

export type Ingredient = typeof ingredients.$inferSelect;
export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type UpdateIngredient = z.infer<typeof updateIngredientSchema>;
