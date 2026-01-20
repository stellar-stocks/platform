import { NextRequest, NextResponse } from "next/server";
import {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getWalletById,
  getWalletsByUserId,
  createWallet,
  updateWallet,
  deleteWallet,
} from "@repo/db/src/queries";
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
} from "@repo/db/src/errors";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const walletId = searchParams.get("walletId");
  try {
    if (userId) {
      const user = await getUserById(userId);
      if (!user) throw new NotFoundError("User not found");
      return NextResponse.json(user);
    }
    if (walletId) {
      const wallet = await getWalletById(walletId);
      if (!wallet) throw new NotFoundError("Wallet not found");
      return NextResponse.json(wallet);
    }
    throw new ValidationError("Missing userId or walletId");
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    if (body.type === "user") {
      const user = await createUser(body.data);
      return NextResponse.json(user);
    }
    if (body.type === "wallet") {
      const wallet = await createWallet(body.data);
      return NextResponse.json(wallet);
    }
    throw new ValidationError("Invalid type");
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  try {
    if (body.type === "user") {
      const user = await updateUser(body.id, body.data);
      return NextResponse.json(user);
    }
    if (body.type === "wallet") {
      const wallet = await updateWallet(body.id, body.data);
      return NextResponse.json(wallet);
    }
    throw new ValidationError("Invalid type");
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const walletId = searchParams.get("walletId");
  try {
    if (userId) {
      await deleteUser(userId);
      return NextResponse.json({ success: true });
    }
    if (walletId) {
      await deleteWallet(walletId);
      return NextResponse.json({ success: true });
    }
    throw new ValidationError("Missing userId or walletId");
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
