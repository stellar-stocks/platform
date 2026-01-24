"use client";

import { AppKitButton } from "@reown/appkit/react";

import { ConnectButton } from "@/components/connect-button";
import React from "react";

export default function Bridge() {
  return (
    <div>
      <h1>Bridge</h1>

      <div className="flex flex-col items-center justify-center gap-4">
        <AppKitButton />
        <ConnectButton />
      </div>
    </div>
  );
}
