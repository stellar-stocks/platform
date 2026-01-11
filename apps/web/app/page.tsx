"use client";

import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";

export default function Home() {
  const { ready } = usePrivy();

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Button>Get Started</Button>
    </div>
  );
}
