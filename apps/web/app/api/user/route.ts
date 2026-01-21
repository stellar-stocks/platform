import { NextRequest, NextResponse } from "next/server";
import {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@repo/db/src/queries";
import { AppError } from "@repo/db/src/errors";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  try {
    if (!email) throw new AppError("bad_request:user", "Missing email");
    const users = await getUser(email);
    if (!users.length) throw new AppError("not_found:user", "User not found");
    return NextResponse.json(users[0]);
  } catch (error: any) {
    if (error instanceof AppError) return error.toResponse();
    return new AppError("internal:user", error.message).toResponse();
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const user = await createUser(body);
    return NextResponse.json(user);
  } catch (error: any) {
    if (error instanceof AppError) return error.toResponse();
    return new AppError("internal:user", error.message).toResponse();
  }
}
