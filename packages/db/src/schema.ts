import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

// Users Table
export const user = pgTable("user", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  walletId: text("wallet_id").notNull(),
  email: text("email").notNull().unique(),
  isKYCVerified: boolean("is_kyc_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const wallet = pgTable("wallet", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  address: text("address").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = InferSelectModel<typeof user>;
export type Wallet = InferSelectModel<typeof wallet>;
