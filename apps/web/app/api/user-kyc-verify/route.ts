import { NextRequest, NextResponse } from "next/server";
import { updateUser, getUser } from "@repo/db/src/queries";
import { User } from "@repo/db/src/schema";

export async function POST(req: NextRequest) {
  const { email, walletId } = await req.json();
  if (!email && !walletId)
    return NextResponse.json(
      { error: "Missing email or walletId" },
      { status: 400 },
    );
  try {
    let users: User[] = [];
    if (walletId) {
      users = await getUser(walletId);
    }
    if ((!users || !users.length) && email) {
      let users: User[] = [];
      users = await getUser(email);
    }
    if (!users.length)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    let user = users[0];
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // If user has no walletId but one is provided, update it
    let updateFields: any = { isKYCVerified: true };
    if (walletId && !user.walletId) {
      updateFields.walletId = walletId;
    }
    const updated = await updateUser(user.id, updateFields);
    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
