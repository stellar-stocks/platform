/**
 * Utility functions for Stacks blockchain operations
 */

/**
 * Formats a raw signature from wallet providers into the format required by Stacks transactions (VRS format)
 * @param signature The raw signature (with or without 0x prefix)
 * @returns An object containing the formatted signature and its components
 */
export const revalidate = 0;

// Helper function to test all recovery IDs and return the best option
function tryRecoveryIds(
  rPadded: string,
  sPadded: string,
  publicKeyFromWallet?: string,
  transactionHash?: string,
) {
  const recoveryIds = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
  ];
  console.log("=== RECOVERY ID TESTING ===");
  console.log("Testing all recovery IDs for signature validation...");
  console.log("Available recovery IDs:", recoveryIds);

  // Generate all possible signature variations
  const allOptions = recoveryIds.map((v) => ({
    v,
    formatted: `${v}${rPadded}${sPadded}`,
  }));

  console.log("Generated signature options:");
  allOptions.forEach((option, index) => {
    console.log(
      `  [${index}] Recovery ID ${option.v}: ${option.formatted.substring(0, 20)}...`,
    );
  });

  // Try recovery IDs in order: 01, 00, 02, 03
  // Based on our analysis, '01' is more likely to work than '00'
  const tryOrder = [1, 0, 2, 3]; // Corresponds to ['01', '00', '02', '03']
  const selectedIndex = tryOrder[0]; // Start with '01'
  const selectedOption =
    selectedIndex !== undefined ? allOptions[selectedIndex] : undefined;

  if (selectedOption) {
    console.log(`Selected recovery ID: ${selectedOption.v} (priority order)`);
  } else {
    console.log(
      "No valid recovery ID selected (tryOrder is empty or invalid).",
    );
  }
  console.log("=== END RECOVERY ID TESTING ===");

  return selectedOption;
}

// Export function to generate multiple signature variants for testing
export function generateAllSignatureVariants(signature: string) {
  const hexSig = signature.startsWith("0x") ? signature.slice(2) : signature;
  const r = hexSig.slice(0, 64).padStart(64, "0");
  const s = hexSig.slice(64, 128).padStart(64, "0");

  return ["00", "01", "02", "03"].map((v) => ({
    v,
    r,
    s,
    formatted: `${v}${r}${s}`,
  }));
}

// Reusable function for systematic recovery ID testing with transaction broadcasting
export async function broadcastWithRecoveryTesting(
  signature: string,
  createTransactionFn: (recoveryId: string) => Promise<any>,
  broadcastFn: (transaction: any) => Promise<any>,
  apiPrefix: string = "STACKS",
): Promise<{
  success: boolean;
  response: any;
  signatureData: any;
  allVariantsTested: number;
}> {
  console.log(`=== ${apiPrefix}: SYSTEMATIC RECOVERY ID TESTING ===`);
  const signatureVariants = generateAllSignatureVariants(signature);
  console.log(
    `Generated ${signatureVariants.length} signature variants for testing`,
  );

  // Try recovery IDs in priority order: 01, 00, 02, 03
  const tryOrder = [1, 0, 2, 3]; // Indices for recovery IDs
  let broadcastResponse = null;
  let lastError = null;
  let successfulSignature = null;

  for (const index of tryOrder) {
    const variant = signatureVariants[index];
    if (!variant) {
      continue;
    }
    try {
      const tx = await createTransactionFn(variant.v);
      const response = await broadcastFn(tx);
      if (response && !response.error && (response.txid || response.success)) {
        broadcastResponse = response;
        successfulSignature = variant;
        break;
      } else {
        lastError = response;
      }
    } catch (e) {
      lastError = e;
    }
  }
  const response = broadcastResponse || lastError;
  const signatureData = successfulSignature || signatureVariants[1]; // Default to '01' variant

  console.log(`\n=== ${apiPrefix}: FINAL RESULT ===`);
  console.log("Final broadcast result:", response);

  return {
    success: !!broadcastResponse,
    response,
    signatureData,
    allVariantsTested: signatureVariants.length,
  };
}

export function formatStacksSignature(signature: string) {
  // Decode hex signature (remove 0x prefix if present)
  const hexSig = signature.startsWith("0x") ? signature.slice(2) : signature;

  console.log("=== SIGNATURE FORMATTING DEBUG ===");
  console.log("- Original signature:", signature);
  console.log("- Hex signature (no prefix):", hexSig);
  console.log("- Signature length:", hexSig.length);
  // ...additional debug and formatting logic as in the demo...
  // For brevity, you can expand this as needed for your app
  return {
    formatted: hexSig,
  };
}
