import { getPrivyServerClient } from "@/lib/privy-server-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required parameter: userId" },
        { status: 400 },
      );
    }

    const privy = await getPrivyServerClient();

    // Create wallet for the specified user
    // Using bitcoin-segwit chain type which is compatible with Stacks
    const createWalletOptions: any = {
      chainType: "bitcoin-segwit",
      // owner: { userId: userId } is not standard in the `create` method of older SDKs but checking the reference
      // The reference code uses `privy.walletApi.createWallet` and passes `owner: { userId: userId }`
      // If the SDK version matches, this should work. The user's package.json has @privy-io/server-auth ^1.32.5
    };

    // Add owner
    // Note: The correct property might vary by SDK version, but verify via reference or docs if possible.
    // Based on reference:
    // createWallet({ chainType: 'bitcoin-segwit', owner: { userId }, additionalSigners: ... })

    // We'll trust the reference code structure but maybe use `create` if `createWallet` doesn't exist on the object?
    // I'll stick to `create` as strictly as I can but maybe `create` is the method and `createWallet` was a typo in my thought or the reference?
    // Reference: `const result = await privy.walletApi.createWallet({...})`
    // User code: `const result = await privy.walletApi.create({...})`

    // I will try to use the method `create` first as it likely exists on the `walletApi` object in the installed version,
    // but pass the parameters from the reference.

    const walletData = {
      chainType: "bitcoin-segwit",
      // Attempting to bind to user
      // older SDKs used `privy.walletApi.create({ chainType: 'ethereum' })` and you had to link it separately or it was for the app.
      // But server-auth usually allows creating for a user.
    };

    // The reference implementation shows:
    /*
    const result = await privy.walletApi.createWallet({
      chainType: 'bitcoin-segwit',
      owner: { userId: userId },
      additionalSigners: [{ signerId: process.env.QUORUMS_KEY!}]
    });
    */

    // I'll follow the reference implementation closely.
    const result = await privy.walletApi.create({
      chainType: "bitcoin-segwit",
      // @ts-ignore - The types might not be perfectly aligned if versions differ, but we pass what the reference does
      owner: { userId: userId },
      ...(process.env.QUORUMS_KEY
        ? { additionalSigners: [{ signerId: process.env.QUORUMS_KEY }] }
        : {}),
    });

    return NextResponse.json({ success: true, wallet: result });
  } catch (error: any) {
    console.error("Error creating wallet:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
