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
import { AppError } from "./lib/errors";

  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    throw new AppError("bad_request:database", "Failed to get user by email");
  }
}

  try {
    const result = await db.select().from(user).where(eq(user.id, id));
    return result[0] ?? null;
  } catch (error) {
    throw new AppError("bad_request:database", "Failed to get user by id");
  }
}

  data: Omit<User, "id" | "createdAt" | "updatedAt">,
): Promise<User> {
  try {
    if (!data.walletId || !data.email) {
      throw new AppError("validation:user", "walletId and email are required");
    }
    const [created] = await db.insert(user).values(data).returning();
    if (!created) {
      throw new AppError("bad_request:database", "Failed to create user");
    }
    return created;
  } catch (error) {
    throw new AppError("bad_request:database", "Failed to create user");
  }
}

  id: string,
  data: Partial<User>,
): Promise<User> {
  try {
    const [updated] = await db
      .update(user)
      .set(data)
      .where(eq(user.id, id))
      .returning();
    if (!updated) {
      throw new AppError("bad_request:database", "Failed to update user");
    }
    return updated;
  } catch (error) {
    throw new AppError("bad_request:database", "Failed to update user");
  }
}

  try {
    await db.delete(user).where(eq(user.id, id));
  } catch (error) {
    throw new AppError("bad_request:database", "Failed to delete user");
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

export async function createWallet(
  data: Omit<Wallet, "id" | "createdAt" | "updatedAt">
): Promise<Wallet> {
  try {
    // Ensure required fields are present
    if (!data.userId || !data.address) {
      throw new Error("userId and address are required");
    }
    const [created] = await db.insert(wallet).values(data).returning();
    if (!created) {
      throw new Error("bad_request:database");
    }
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
    if (!updated) {
      throw new Error("bad_request:database");
    }
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
