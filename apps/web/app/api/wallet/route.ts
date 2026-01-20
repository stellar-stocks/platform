import { NextRequest, NextResponse } from "next/server";
import {
  getWalletById,
  getWalletsByUserId,
  createWallet,
  updateWallet,
  deleteWallet,
} from "@repo/db/src/queries";
import { NotFoundError, ValidationError } from "@repo/db/src/errors";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");
  try {
    if (id) {
      const wallet = await getWalletById(id);
      if (!wallet) throw new NotFoundError("Wallet not found");
      return NextResponse.json(wallet);
    }
    if (userId) {
      const wallets = await getWalletsByUserId(userId);
      return NextResponse.json(wallets);
    }
    throw new ValidationError("Missing id or userId");
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const wallet = await createWallet(body);
    return NextResponse.json(wallet);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
