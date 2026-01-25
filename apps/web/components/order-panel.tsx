"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

import { AnimatePresence, motion } from "motion/react";

// interface DiamondSliderProps {
//   value: number;
//   min: number;
//   max: number;
//   onChange: (value: number) => void;
//   step?: number;
//   markerSize?: number;
// }

// const DiamondSlider: React.FC<DiamondSliderProps> = ({
//   value,
//   min,
//   max,
//   onChange,
//   step = 1,
//   markerSize = 6, // Much smaller markers
// }) => {
//   const trackRef = useRef<HTMLDivElement>(null);
//   const [isDragging, setIsDragging] = useState(false);

//   // Padding for the track ends so the thumb doesn't overlap the steppers
//   const SIDE_PADDING = 12;

//   const markers = useMemo(() => [0, 25, 50, 75, 100], []);

//   const updateValueFromCoord = useCallback(
//     (clientX: number) => {
//       if (!trackRef.current) return;
//       const rect = trackRef.current.getBoundingClientRect();

//       const innerWidth = rect.width - SIDE_PADDING * 2;
//       const relativeX = clientX - (rect.left + SIDE_PADDING);

//       const clampedX = Math.max(0, Math.min(relativeX, innerWidth));
//       const percentage = clampedX / innerWidth;

//       const rawValue = min + percentage * (max - min);
//       const steppedValue = Math.round(rawValue / step) * step;

//       onChange(Math.max(min, Math.min(max, steppedValue)));
//     },
//     [min, max, step, onChange],
//   );

//   const handleMouseDown = (e: React.MouseEvent) => {
//     setIsDragging(true);
//     updateValueFromCoord(e.clientX);
//   };

//   const handleTouchStart = (e: React.TouchEvent) => {
//     if (!e.touches || e.touches.length === 0) return;
//     setIsDragging(true);
//     updateValueFromCoord(e.touches[0].clientX);
//   };

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (isDragging) {
//         updateValueFromCoord(e.clientX);
//       }
//     };

//     const handleMouseUp = () => setIsDragging(false);

//     if (isDragging) {
//       window.addEventListener("mousemove", handleMouseMove);
//       window.addEventListener("mouseup", handleMouseUp);
//     }

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging, updateValueFromCoord]);

//   const percentage = ((value - min) / (max - min)) * 100;

//   const springConfig = {
//     type: "spring",
//     stiffness: 1000,
//     damping: 60,
//     mass: 0.4,
//   } as const;
//   const tooltipSpring = {
//     type: "spring",
//     stiffness: 1500,
//     damping: 70,
//     mass: 0.2,
//   } as const;

//   return (
//     <div className="w-full select-none space-y-4" id="precision-slider">
//       <div className="flex items-center gap-3">
//         {/* Compact Slider Track */}
//         <div
//           ref={trackRef}
//           className={`relative flex-1 h-10 flex items-center bg-[#0d0d0d] border border-white/5 rounded-lg ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
//           onMouseDown={handleMouseDown}
//           onTouchStart={handleTouchStart}
//           style={{ paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING }}
//         >
//           <div className="relative w-full h-[2px]">
//             {/* Background Rail */}
//             <div className="absolute inset-0 bg-white/5 rounded-full" />

//             {/* Progress Overlay */}
//             <motion.div
//               className="absolute inset-y-0 left-0 bg-white/20 rounded-full z-0"
//               animate={{ width: `${percentage}%` }}
//               transition={springConfig}
//             />

//             {/* Micro Markers */}
//             <div className="absolute inset-0 pointer-events-none">
//               {markers.map((m) => (
//                 <div
//                   key={m}
//                   style={{
//                     left: `${m}%`,
//                     width: markerSize,
//                     height: markerSize,
//                     transform: "translate(-50%, -50%) rotate(45deg)",
//                     top: "50%",
//                   }}
//                   className={`absolute border transition-colors duration-300 ${value >= m ? "bg-white/40 border-white/40" : "bg-transparent border-white/10"}`}
//                 />
//               ))}
//             </div>

//             {/* Compact Tooltip */}
//             <AnimatePresence>
//               {isDragging && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10, scale: 0.9 }}
//                   animate={{ opacity: 1, y: -45, scale: 1 }}
//                   exit={{ opacity: 0, y: 10, scale: 0.9 }}
//                   transition={tooltipSpring}
//                   style={{ left: `${percentage}%`, x: "-50%" }}
//                   className="absolute flex flex-col items-center pointer-events-none z-30"
//                 >
//                   <div className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap uppercase tracking-tighter">
//                     {value}%
//                   </div>
//                   <div className="w-[1px] h-2 bg-white/50 mt-1" />
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Compact Thumb */}
//             <motion.div
//               className="absolute z-10 pointer-events-none"
//               animate={{ left: `${percentage}%` }}
//               transition={springConfig}
//               style={{ x: "-50%", top: "50%", y: "-50%" }}
//             >
//               <motion.div
//                 animate={{ rotate: 45, scale: isDragging ? 1.2 : 1 }}
//                 className="w-4 h-4 bg-white border border-white shadow-[0_0_12px_rgba(255,255,255,0.3)] flex items-center justify-center"
//               >
//                 <div className="w-1 h-1 bg-black rounded-full" />
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

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
      {/* <div className="flex gap-2">
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
      </div> */}

      {/* Side Selector */}
      <div className="flex gap-1 bg-[#1e2329]/50 rounded-lg p-1 relative">
        {[
          { id: "buy", label: "Buy", color: "#2ebd85" },
          { id: "sell", label: "Sell", color: "#f6465d" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSide(tab.id as "buy" | "sell")}
            className={`relative flex-1 py-2 px-3 rounded-md text-sm font-bold transition-all z-10 ${
              side === tab.id
                ? "text-white"
                : "text-[#848e9c] hover:text-white/60"
            }`}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {side === tab.id && (
              <motion.span
                layoutId="activeTab"
                className="absolute inset-0 rounded-md"
                style={{ backgroundColor: tab.color }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.2 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>
      {/* Limit Price Input - Only show for limit orders */}
      {/* {orderType === "limit" && (
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
      )} */}

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
