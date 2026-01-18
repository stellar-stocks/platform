"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";

export default function AuthButton() {
  const { login, authenticated, user, logout } = usePrivy();

  if (!authenticated) {
    return <Button onClick={login}>Connect with Privy</Button>;
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <p className="text-sm text-gray-600">
        Logged in as:{" "}
        {user?.email?.address || user?.wallet?.address || user?.id}
      </p>
      <Button variant="outline" onClick={logout}>
        Disconnect
      </Button>
    </div>
  );
}
