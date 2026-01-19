import { ConnectButton } from "./connect-button";

export default function Header() {
  return (
    <header className="w-full mx-auto max-w-screen-xl px-4 py-2 flex items-center justify-between">
      <h1 className="text-2xl">Stellar Stocks</h1>
      <ConnectButton />
    </header>
  );
}
