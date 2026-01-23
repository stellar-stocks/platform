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
} from "@repo/db/queries";
import { AppError } from "@repo/db/errors";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const walletId = searchParams.get("walletId");
  try {
    if (userId) {
      const user = await getUserById(userId);
      if (!user) throw new AppError("not_found:user", "User not found");
      return NextResponse.json(user);
    }
    if (walletId) {
      const wallet = await getWalletById(walletId);
      if (!wallet) throw new AppError("not_found:wallet", "Wallet not found");
      return NextResponse.json(wallet);
    }
    throw new AppError("bad_request:api", "Missing userId or walletId");
  } catch (error: any) {
    if (error instanceof AppError) return error.toResponse();
    return new AppError("internal:api", error.message).toResponse();
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
    throw new AppError("bad_request:api", "Invalid type");
  } catch (error: any) {
    if (error instanceof AppError) return error.toResponse();
    return new AppError("internal:api", error.message).toResponse();
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
    throw new AppError("bad_request:api", "Invalid type");
  } catch (error: any) {
    if (error instanceof AppError) return error.toResponse();
    return new AppError("internal:api", error.message).toResponse();
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
    throw new AppError("bad_request:api", "Missing userId or walletId");
  } catch (error: any) {
    if (error instanceof AppError) return error.toResponse();
    return new AppError("internal:api", error.message).toResponse();
  }
}
