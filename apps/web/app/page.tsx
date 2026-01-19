"use client";
import { ConnectButton } from "../components/connect-button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-2xl font-bold mb-8 text-center">Stellar Stocks</h1>
      <ConnectButton />
    </main>
  );
}
