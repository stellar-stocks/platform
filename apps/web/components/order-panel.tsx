"use client";

import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const OrderPanel: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(0);
  const [limitPrice, setLimitPrice] = useState<string>("3348.33");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"market" | "limit">("limit");
  const [percentage, setPercentage] = useState(21);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState<string>("");
  const [isKYCVerified, setIsKYCVerified] = useState<boolean>(false);
  const { user } = usePrivy();

  // Fetch KYC status on mount or when user changes
  useEffect(() => {
    const fetchKYC = async () => {
      if (!user?.wallet?.address) return;
      try {
        const res = await fetch(
          `/api/user?walletId=${encodeURIComponent(user.wallet.address)}`,
        );
        const data = await res.json();
        setIsKYCVerified(!!data.isKYCVerified);
      } catch {
        setIsKYCVerified(false);
      }
    };
    fetchKYC();
  }, [user?.wallet?.address]);

  const getVerificationUrl = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isIframe: false,
          vendor_data: user?.wallet?.address || "",
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
    if (!user?.wallet?.address) {
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

  return (
    <div className="bg-[#0b0e11] p-4 space-y-4">
      {/* Order Type Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setOrderType("market")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
            orderType === "market"
              ? "bg-[#1e2329] text-white"
              : "bg-[#1e2329]/50 text-[#848e9c]"
          }`}
        >
          Market
        </button>
        <button
          onClick={() => setOrderType("limit")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
            orderType === "limit"
              ? "bg-[#1e2329] text-white"
              : "bg-[#1e2329]/50 text-[#848e9c]"
          }`}
        >
          Limit
        </button>
      </div>

      {/* Side Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setSide("buy")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
            side === "buy"
              ? "bg-[#2ebd85] text-white"
              : "bg-[#1e2329] text-[#848e9c]"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
            side === "sell"
              ? "bg-[#f6465d] text-white"
              : "bg-[#1e2329] text-[#848e9c]"
          }`}
        >
          Sell
        </button>
      </div>

      {/* Limit Price Input - Only show for limit orders */}
      {orderType === "limit" && (
        <div className="group relative">
          <div className="bg-[#1e2329] border border-[#2b2f36] group-focus-within:border-[#5e6673] rounded-xl p-3 transition-all">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold text-[#848e9c] uppercase tracking-wider">
                Limit Price
              </label>
              <div className="text-[11px] font-bold text-[#eaecef]">
                3348.33 <span className="text-[#848e9c] ml-1">Mid</span>
              </div>
            </div>
            <input
              // ✅ REMOVED defaultValue - using controlled input
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              type="text"
              className="w-full bg-transparent text-right outline-none text-sm font-bold text-white pr-1"
            />
          </div>
        </div>
      )}

      {/* Quantity Input */}
      <div className="group relative">
        <div className="bg-[#1e2329] border border-[#2b2f36] group-focus-within:border-[#5e6673] rounded-xl p-3 transition-all">
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] font-bold text-[#848e9c] uppercase tracking-wider">
              Quantity
            </label>
            <div className="text-[11px] font-bold text-[#eaecef]">
              {quantity}
            </div>
          </div>
          <input
            // ✅ REMOVED defaultValue - using controlled input
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 0)} // Added fallback to prevent NaN
            type="text"
            className="w-full bg-transparent text-right outline-none text-sm font-bold text-white pr-1"
          />
        </div>
      </div>

      {/* Percentage Buttons */}
      <div className="grid grid-cols-5 gap-1">
        {[10, 25, 50, 75, 100].map((percent) => (
          <button
            key={percent}
            onClick={() => setPercentage(percent)}
            className={`py-1 px-2 rounded text-xs font-bold transition-all ${
              percentage === percent
                ? "bg-[#1e2329] text-white"
                : "bg-[#1e2329]/50 text-[#848e9c]"
            }`}
          >
            {percent}%
          </button>
        ))}
      </div>

      {/* Order Button */}
      <Button
        onClick={handleOrder}
        disabled={quantity <= 0 || isLoading}
        className={`w-full py-3 rounded-lg font-bold transition-all ${
          side === "buy"
            ? "bg-[#2ebd85] hover:bg-[#26a672] text-white"
            : "bg-[#f6465d] hover:bg-[#d03a4d] text-white"
        } ${quantity <= 0 || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading ? "Loading..." : `${side === "buy" ? "Buy" : "Sell"} ${side === "buy" ? "/" : ""}${side === "buy" ? "Long" : "Short"}`}
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
