import { NextRequest, NextResponse } from "next/server";
import {
  getWalletById,
  getWalletsByUserId,
  createWallet,
} from "@repo/db/queries";
import { AppError } from "@repo/db/errors";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");
  try {
    if (id) {
      const wallet = await getWalletById(id);
      if (!wallet) throw new AppError("not_found:wallet", "Wallet not found");
      return NextResponse.json(wallet);
    }
    if (userId) {
      const wallets = await getWalletsByUserId(userId);
      return NextResponse.json(wallets);
    }
    throw new AppError("bad_request:wallet", "Missing id or userId");
  } catch (error: any) {
    if (error instanceof AppError) return error.toResponse();
    return new AppError("internal:wallet", error.message).toResponse();
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const wallet = await createWallet(body);
    return NextResponse.json(wallet);
  } catch (error: any) {
    if (error instanceof AppError) return error.toResponse();
    return new AppError("internal:wallet", error.message).toResponse();
  }
}
