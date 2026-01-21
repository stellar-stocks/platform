import { NextRequest, NextResponse } from "next/server";
import { updateUser, getUser } from "@repo/db/src/queries";
import { AppError } from "@repo/db/src/errors";
import { User } from "@repo/db/src/schema";

export async function POST(req: NextRequest) {
  const { email, walletId } = await req.json();
  if (!email && !walletId)
    return new AppError(
      "bad_request:kyc",
      "Missing email or walletId",
    ).toResponse();
  try {
    let users: User[] = [];
    if (walletId) {
      users = await getUser(walletId);
    }
    if ((!users || !users.length) && email) {
      users = await getUser(email);
    }
    if (!users.length) throw new AppError("not_found:kyc", "User not found");
    let user = users[0];
    if (!user) {
      throw new AppError("not_found:kyc", "User not found");
    }
    // If user has no walletId but one is provided, update it
    let updateFields: any = { isKYCVerified: true };
    if (walletId && !user.walletId) {
      updateFields.walletId = walletId;
    }
    const updated = await updateUser(user.id, updateFields);
    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    if (error instanceof AppError) return error.toResponse();
    return new AppError("internal:kyc", error.message).toResponse();
  }
}
