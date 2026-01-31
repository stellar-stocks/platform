"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useStacksWallet } from "@/hooks/use-stacks-wallet";
import { Button, buttonVariants } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { AnimatePresence, motion } from "motion/react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";

const OrderPanel: React.FC = () => {
  const { address, isConnected } = useStacksWallet();
  const [balance, setBalance] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [limitPrice, setLimitPrice] = useState<string>("3348.33");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"market" | "limit">("limit");
  const [percentage, setPercentage] = useState(21);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState<string>("");
  const [isKYCVerified, setIsKYCVerified] = useState<boolean>(false);

  // Slider constants
  const TICKS = [0, 25, 50, 75, 100];
  const SNAP_THRESHOLD = 3;
  const min = 0;
  const max = 100;

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) {
        setBalance(0);
        return;
      }

      // Determine network based on address prefix
      // ST... is testnet, SP... (or others) is mainnet
      const isTestnet = address.startsWith("ST") || address.startsWith("SN");
      const baseUrl = isTestnet
        ? "https://api.testnet.hiro.so"
        : "https://api.hiro.so";

      try {
        const response = await fetch(
          `${baseUrl}/extended/v1/address/${address}/balances`
        );
        const data = await response.json();
        
        console.log("Wallet Balance Data:", data);

        // Targeted Token Identifier
        // On testnet, we use the mock USDCx
        // On mainnet, we should ideally look for the real USDC or similar, but for now let's stick to the request context
        const usdcxKey = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx::usdcx";
        
        // Check for specific token first
        let amount = 0;
        if (data.fungible_tokens && data.fungible_tokens[usdcxKey]) {
          amount = Number(data.fungible_tokens[usdcxKey].balance);
        } else {
             // Fallback: Check for ANY token that looks like USDC if the specific one isn't found
            // This is helpful if the user deployed their own mock
             const foundToken = Object.keys(data.fungible_tokens || {}).find(key => key.toLowerCase().includes("usdc"));
             if (foundToken) {
                 amount = Number(data.fungible_tokens[foundToken].balance);
             }
        }

        // Divide by decimals (6 for USDC)
        setBalance(amount / 1000000);

      } catch (error) {
        console.error("Failed to fetch balance:", error);
        setBalance(0);
      }
    };

    fetchBalance();
  }, [address]);

  // Fetch KYC status on mount or when user changes
  useEffect(() => {
    const fetchKYC = async () => {
      if (!address) return;
      try {
        const res = await fetch(
          `/api/user?walletId=${encodeURIComponent(address)}`,
        );
        const data = await res.json();
        setIsKYCVerified(!!data.isKYCVerified);
      } catch {
        setIsKYCVerified(false);
      }
    };
    fetchKYC();
  }, [address]);

  const getVerificationUrl = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isIframe: false,
          vendor_data: address || "",
        }),
      });
      const data = await res.json();
      if (data.url) {
        setVerificationUrl(data.url);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to get verification URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    if (!isKYCVerified) {
      await getVerificationUrl();
      return;
    }

    // Handle order logic here
    console.log("Order placed:", { side, orderType, quantity, limitPrice });
  };

  // Update quantity based on percentage
  const updateQuantityFromPercentage = useCallback((percent: number) => {
    // efficient calculation using current balance
    const newQuantity = Math.floor((percent / 100) * balance);
    setQuantity(newQuantity);
    setPercentage(percent);
  }, [balance]);

  // Specific colors for the variant
  const colors = useMemo(() => {
    if (side === "sell") {
      return {
        trackBase: "bg-[#1e1414]",
        trackFill: "bg-gradient-to-l from-[#ef4444] to-transparent",
        inputBorder: "focus-within:border-red-500/40",
        thumb: "#ef4444",
      };
    }
    return {
      trackBase: "bg-[#181a1f]",
      trackFill: "bg-gradient-to-l from-[#34d399] to-transparent",
      inputBorder: "focus-within:border-emerald-500/40",
      thumb: "#34d399",
    };
  }, [side]);

  // Slider snapping logic
  const snapToTick = (val: number): number => {
    for (const tick of TICKS) {
      if (Math.abs(val - tick) <= SNAP_THRESHOLD) {
        return tick;
      }
    }
    return val;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    const snappedVal = snapToTick(val);
    updateQuantityFromPercentage(snappedVal);
  };

  // FIXED: Proper number input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Handle empty input
    if (inputValue === "") {
      setPercentage(0);
      updateQuantityFromPercentage(0);
      return;
    }

    // Parse and validate number
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue)) return;

    // Clamp to min/max bounds
    const clamped = Math.max(min, Math.min(max, numValue));

    // Snap to nearest tick
    const snappedVal = snapToTick(clamped);

    // Update state
    updateQuantityFromPercentage(snappedVal);
  };

  return (
    <div className="bg-[#0b0e11] p-4 space-y-4">
      {/* Side Selector */}
      <div className="flex gap-1 bg-[#1e2329]/50 rounded-lg p-1 relative">
        {[
          { id: "buy", label: "Buy", color: "#2ebd85" },
          { id: "sell", label: "Sell", color: "#f6465d" },
        ].map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setSide(tab.id as "buy" | "sell")}
            variant={"ghost"}
            className="relative flex-1"
          >
            {side === tab.id && (
              <motion.span
                layoutId="activeTab"
                className={cn(
                  "absolute inset-0 rounded-lg z-0",
                  buttonVariants({
                    variant: side === "buy" ? "success" : "destructive",
                  }).toString(),
                )}
                transition={{ type: "spring", bounce: 0.2, duration: 0.2 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3">
        <h1>Available: </h1>

        <div className="flex gap-2 items-center justify-center">
          <label className="text-[14px] text-[#848e9c] uppercase tracking-wider">
            {balance} USDCx
          </label>
          <Image
            src="/icons/usdc.png"
            className="rounded-full"
            alt="USDCx Logo"
            width={20}
            height={20}
          />
        </div>
      </div>

      {/* Quantity Input */}
      <div className="group relative">
        <div className="h-12 bg-[#1e2329] border border-[#2b2f36] group-focus-within:border-[#5e6673] rounded-[2px] px-3 flex justify-between items-center">
          <label className="text-[10px] font-bold text-[#848e9c] uppercase tracking-wider">
            Quantity
          </label>

          <div className="flex items-center justify-center gap-1">
            <input
              max={balance}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 0;
                setQuantity(Math.max(0, val));
              }}
              type="number"
              className="w-full bg-transparent text-right outline-none text-sm font-bold text-white pr-1"
            />
            <div>USDCx</div>
          </div>
        </div>
      </div>

      {/* Slider with Percentage Input */}
      <div
        className="flex items-center gap-4 w-full select-none"
        style={{ "--thumb-color": colors.thumb, "--thumb-size": "8px" } as React.CSSProperties}
      >
        <div className="relative flex-1 h-8 flex items-center">
          {/* Static Background Track */}
          <div
            className={`absolute inset-0 top-1/2 -translate-y-1/2 h-[10px] w-full ${colors.trackBase} rounded-full border border-white/5`}
          >
            {/* Fading Progress Fill - Right to Left gradient (hottest at thumb) */}
            <div
              className={`absolute left-0 top-0 h-full ${colors.trackFill} rounded-full opacity-90`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Tick Marks - Positioned behind the thumb but on top of track */}
          <div className="absolute inset-0 flex justify-between items-center px-[6px] pointer-events-none z-0">
            {TICKS.map((tick) => (
              <div
                key={tick}
                className={`w-[4px] h-[14px] rounded-full ${
                  tick <= percentage ? "bg-white/40" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <input
            type="range"
            min={min}
            max={max}
            step={1}
            value={percentage}
            onChange={handleSliderChange}
            className="custom-range relative z-10 w-full h-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--thumb-color)] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-95"
          />
        </div>
      </div>

      {/* Order Button */}
      <Button
        onClick={handleOrder}
        disabled={quantity <= 0 || isLoading}
        variant={side == "buy" ? "success" : "destructive"}
        className="w-full"
      >
        {isLoading
          ? "Loading..."
          : `${side === "buy" ? "Buy" : "Sell"} ${side === "buy" ? "/" : ""}${side === "buy" ? "Long" : "Short"}`}
      </Button>

      {/* KYC Verification Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <DialogContent className="bg-[#0b0e11] border-[#1e2329] text-white">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-bold">KYC Verification Required</h3>
            <p className="text-[#848e9c]">
              You need to complete KYC verification to start trading.
            </p>
            <Button
              onClick={() => window.open(verificationUrl, "_blank")}
              className="w-full bg-[#2ebd85] hover:bg-[#26a672]"
            >
              Complete Verification
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderPanel;
