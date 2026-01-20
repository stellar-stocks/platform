import { NextRequest, NextResponse } from "next/server";
import {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@repo/db/src/queries";
import { NotFoundError, ValidationError } from "@repo/db/src/errors";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  try {
    if (!email) throw new ValidationError("Missing email");
    const users = await getUser(email);
    if (!users.length) throw new NotFoundError("User not found");
    return NextResponse.json(users[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const user = await createUser(body);
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
