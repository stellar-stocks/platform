import { NextRequest, NextResponse } from "next/server";
import { getPrivyServerClient } from "@/lib/privy-server-client";

// GET /api/wallet-owners
export async function GET(request: NextRequest) {
  try {
    const privy = await getPrivyServerClient();
    // Fetch all users using the correct Privy API method
    const users = await privy.getUsers();
    // Extract wallet addresses for each user
    const walletOwners = users.map((user: any) => ({
      userId: user.id,
      wallets: user.wallet || [],
    }));
    return NextResponse.json({ success: true, owners: walletOwners });
  } catch (error: any) {
    console.error("Error fetching wallet owners:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
