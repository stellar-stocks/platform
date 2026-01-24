"use client";

import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

import { motion, MotionConfig } from "motion/react";

const OrderPanel: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(0);
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
      } else {
        alert(data.error || "Failed to get verification URL");
      }
    } catch (err) {
      alert("Error getting verification URL");
    } finally {
      setIsLoading(false);
    }
  };

  // Call this after user completes KYC (simulate for now)
  const updateKYCStatus = async () => {
    if (!user?.wallet?.address) return;
    await fetch("/api/user-kyc-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletId: user.wallet.address }),
    });
    setIsKYCVerified(true);
  };

  const handleTrade = async () => {
    try {
      const res = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: "AAPL",
          qty: quantity,
          side: side,
          type: orderType,
          time_in_force: "day",
        }),
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.2 }}>
      <div className="flex flex-col h-full bg-[#0b0e11] select-none">
        {/* Side Switcher */}
        <div className="p-4 pb-2">
          <div className="flex rounded-sm overflow-hidden bg-[#1e2329] p-0.5 shadow-inner border border-[#2b2f36]">
            {["buy", "sell"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSide(tab as "buy" | "sell")}
                className="rounded-sm p-1 flex-1 text-sm relative"
              >
                <span className="relative z-10">{tab}</span>

                {tab === side && (
                  <motion.span
                    layoutId="side-indicator"
                    className={`absolute inset-0 flex-1 rounded-sm transition-all ${side === tab ? (tab === "buy" ? "bg-[#2ebd85] text-white shadow-lg" : "bg-[#f6465d] text-white shadow-lg") : "text-[#848e9c] hover:text-white -z-1"}`}
                  ></motion.span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-2 flex gap-6 text-[11px] font-bold text-[#848e9c] border-b border-[#1e2329]">
          <button
            onClick={() => setOrderType("limit")}
            className={`${orderType === "limit" ? "text-white border-b-2 border-white" : "hover:text-white"} pb-1.5 transition-colors tracking-tight`}
          >
            Limit
          </button>
          <button
            onClick={() => setOrderType("market")}
            className={`${orderType === "market" ? "text-white border-b-2 border-white" : "hover:text-white"} pb-1.5 transition-colors tracking-tight`}
          >
            Market
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Custom Limit Price Input */}
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
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                type="text"
                defaultValue="3348.33"
                className="w-full bg-transparent text-right outline-none text-sm font-bold text-white pr-1"
              />
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="group relative">
            <div className="bg-[#1e2329] border border-[#2b2f36] group-focus-within:border-[#5e6673] rounded-xl p-3 transition-all">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-[#848e9c] uppercase tracking-wider">
                  Amount
                </label>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#848e9c] hover:text-white cursor-pointer transition-colors">
                  <span>0.0000 AAPL</span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
              <input
                type="text"
                placeholder="0.0000"
                className="w-full bg-transparent text-right outline-none text-sm font-bold text-white pr-1"
              />
            </div>
          </div>

          {/* Zero-Lag Custom Slider */}
          <div className="pt-2 px-1">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative h-10 flex items-center">
                {/* Slider Track Background */}
                <div className="absolute w-full h-[4px] bg-[#1c1e22] rounded-full">
                  <div className="absolute w-full h-full bg-[#2b2f36]"></div>
                </div>

                {/* Slider Progress Fill */}
                <div
                  className="absolute h-[4px] bg-white rounded-full z-10"
                  style={{ width: `${percentage}%` }}
                ></div>

                {/* Custom Designed Thumb: Premium vertical pill */}
                <div
                  className="absolute h-7 w-3.5 bg-white rounded-[4px] cursor-grab active:cursor-grabbing z-30 flex flex-col items-center justify-center border border-white/20"
                  style={{
                    left: `calc(${percentage}% - 7px)`,
                  }}
                >
                  <div className="w-px h-3.5 bg-black/30 rounded-full"></div>
                </div>

                {/* Snap Indicators: Bold Rounded Rectangles (Tall and thick) */}
                {[0, 25, 50, 75, 100].map((mark) => (
                  <div
                    key={mark}
                    className={`absolute w-1.5 h-4 rounded-[3px] z-20 transition-colors duration-200 border border-[#0b0e11]/50 ${percentage >= mark ? "bg-white" : "bg-[#474d57]"}`}
                    style={{ left: `calc(${mark}% - 3px)` }}
                  ></div>
                ))}

                {/* Native Input (Invisible layer for interaction) */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={percentage}
                  onChange={(e) => setPercentage(parseInt(e.target.value))}
                  className="absolute w-full h-full opacity-0 cursor-pointer z-40"
                />
              </div>
              <div className="bg-[#1e2329] border border-[#2b2f36] rounded-lg px-2 py-1 flex items-center gap-1 min-w-[50px] justify-center shadow-sm">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={percentage}
                  onChange={(e) => setPercentage(parseInt(e.target.value))}
                  className="w-full h-full bg-transparent text-center text-[12px] font-bold text-white outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-4 h-4 border border-[#474d57] rounded flex items-center justify-center group-hover:border-[#eaecef] transition-all bg-[#1e2329]">
                <input type="checkbox" className="peer hidden" />
                <div className="w-2.5 h-2.5 bg-white rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-[11px] font-medium text-[#848e9c] group-hover:text-[#eaecef] transition-colors">
                Reduce Only
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-4 h-4 border border-[#474d57] rounded flex items-center justify-center group-hover:border-[#eaecef] transition-all bg-[#1e2329]">
                <input type="checkbox" className="peer hidden" />
                <div className="w-2.5 h-2.5 bg-white rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-[11px] font-medium text-[#848e9c] group-hover:text-[#eaecef] transition-colors">
                Take Profit / Stop Loss
              </span>
            </label>
          </div>

          {/* Show KYC modal if not verified, else show normal trade button */}
          {!isKYCVerified ? (
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-[#eaecef] hover:bg-white text-black font-bold py-3.5 rounded-xl text-[12px] shadow-lg transition-all active:scale-[0.98] mt-2"
                  onClick={async () => {
                    setModalOpen(true);
                    await getVerificationUrl();
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Trade (KYC Required)"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <div className="flex flex-col items-center justify-center py-6">
                  <h2 className="text-lg font-bold mb-2">KYC Required</h2>
                  <p className="mb-4 text-center">
                    To trade, you must complete identity verification (KYC) as
                    required by exchanges.
                  </p>
                  <Button
                    className="w-full bg-[#2ebd85] text-white font-bold py-2 rounded-lg"
                    onClick={async () => {
                      if (verificationUrl) {
                        window.open(verificationUrl, "_blank");
                        // Simulate user returning after KYC (in real app, listen for callback or poll status)
                        setTimeout(updateKYCStatus, 3000);
                      }
                    }}
                    disabled={!verificationUrl}
                  >
                    {verificationUrl
                      ? "Go to Verification"
                      : "Getting Verification Link..."}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              className="w-full bg-[#2ebd85] hover:bg-green-500 text-white font-bold py-3.5 rounded-xl text-[12px] shadow-lg transition-all active:scale-[0.98] mt-2"
              onClick={handleTrade}
            >
              {side === "buy" ? "Buy" : "Sell"}
            </Button>
          )}

          <div className="space-y-3 pt-4 text-[11px] font-medium text-[#848e9c]">
            <div className="flex justify-between items-center">
              <span className="underline decoration-[#2b2f36] underline-offset-4">
                Maximum Order Value
              </span>
              <span className="text-[#eaecef]">-</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="underline decoration-[#2b2f36] underline-offset-4">
                Order Size
              </span>
              <span className="text-[#eaecef]">-</span>
            </div>
            <div className="flex justify-between items-center border-t border-[#1e2329] pt-3 mt-1">
              <span className="text-[#848e9c]">Position Margin</span>
              <span className="text-[#eaecef] font-bold text-sm">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Fees</span>
              <div className="flex items-center gap-2 font-bold">
                <span className="text-[10px] text-[#848e9c]">
                  Taker: <span className="text-white">0%</span>
                </span>
                <span className="text-[10px] text-[#848e9c]">
                  Maker: <span className="text-white">0%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
};

export default OrderPanel;
