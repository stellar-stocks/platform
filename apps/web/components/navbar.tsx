"use client";

import React from "react";
import { ConnectButton } from "./connect-button";
import { Button } from "./ui/button";
import { Cog, Download, Globe, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";

const NavbarLogo = () => (
  <Image src="/logo.svg" alt="Logo" width={32} height={32} />
);

const Navbar: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  const isMobileCheck = useIsMobile();

  const navItems = ["Spot", "Bridge"];

  if (isMobileCheck) {
    return (
      <nav className="h-12 flex items-center justify-between px-3 border-b border-[#1e2329] bg-[#0b0e11] shrink-0">
        <NavbarLogo />
        <div className="flex items-center gap-3">
          <ConnectButton className="text-xs px-2 py-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="h-16 bg-[#181a20] border-b border-[#2b2f36] flex items-center justify-between px-4">
      <div className="flex items-center gap-8">
        <NavbarLogo />
        <div className="hidden xl:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm font-medium hover:text-blue-400 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ConnectButton />
        <div className="flex items-center gap-1 text-[#848e9c]">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Globe className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Cog className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
