import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  type SQL,
} from "drizzle-orm";

import { user, type User } from "./schema";

import { wallet, type Wallet } from "./schema";
import { db } from "../index";

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    throw new Error("bad_request:database");
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await db.select().from(user).where(eq(user.id, id));
    return result[0] ?? null;
  } catch (error) {
    throw new Error("bad_request:database");
  }
}

export async function createUser(data: Partial<User>): Promise<User> {
  try {
    const [created] = await db.insert(user).values(data).returning();
    return created;
  } catch (error) {
    throw new Error("bad_request:database");
  }
}

export async function updateUser(
  id: string,
  data: Partial<User>,
): Promise<User> {
  try {
    const [updated] = await db
      .update(user)
      .set(data)
      .where(eq(user.id, id))
      .returning();
    return updated;
  } catch (error) {
    throw new Error("bad_request:database");
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await db.delete(user).where(eq(user.id, id));
  } catch (error) {
    throw new Error("bad_request:database");
  }
}

export async function getWalletById(id: string): Promise<Wallet | null> {
  try {
    const result = await db.select().from(wallet).where(eq(wallet.id, id));
    return result[0] ?? null;
  } catch (error) {
    throw new Error("bad_request:database");
  }
}

export async function getWalletsByUserId(
  userId: string,
): Promise<Array<Wallet>> {
  try {
    return await db.select().from(wallet).where(eq(wallet.userId, userId));
  } catch (error) {
    throw new Error("bad_request:database");
  }
}

export async function createWallet(data: Partial<Wallet>): Promise<Wallet> {
  try {
    const [created] = await db.insert(wallet).values(data).returning();
    return created;
  } catch (error) {
    throw new Error("bad_request:database");
  }
}

export async function updateWallet(
  id: string,
  data: Partial<Wallet>,
): Promise<Wallet> {
  try {
    const [updated] = await db
      .update(wallet)
      .set(data)
      .where(eq(wallet.id, id))
      .returning();
    return updated;
  } catch (error) {
    throw new Error("bad_request:database");
  }
}

export async function deleteWallet(id: string): Promise<void> {
  try {
    await db.delete(wallet).where(eq(wallet.id, id));
  } catch (error) {
    throw new Error("bad_request:database");
  }
}
