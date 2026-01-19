import React from "react";
import { ConnectButton } from "./connect-button";
import { Button } from "./ui/button";
import { Cog, Download, Globe } from "lucide-react";

const Navbar: React.FC = () => {
  const navItems = [
    "Spot",
    "Futures",
    "TradFi",
    "Bots",
    "Copy",
    "Info",
    "Onchain",
  ];

  return (
    <nav className="h-14 bg-[#181a20] border-b border-[#2b2f36] flex items-center justify-between px-4">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white">
            B
          </div>
          <span className="text-xl font-bold tracking-tight">Bitget</span>
        </div>
        <div className="hidden xl:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium hover:text-blue-400 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ConnectButton />

        <div className="flex items-center gap-1 text-[#848e9c] ml-2">
          <Button variant={"ghost"}>
            <Download />
          </Button>
          <Button variant={"ghost"}>
            <Globe />
          </Button>
          <Button variant={"ghost"}>
            <Cog />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
