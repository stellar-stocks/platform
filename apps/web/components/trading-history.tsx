import React from "react";

const TradeHistory: React.FC = () => {
  const trades = [
    { time: "23:26:30", price: "0.3305", qty: "1.17", side: "buy" },
    { time: "23:26:26", price: "0.3289", qty: "599", side: "sell" },
    { time: "23:26:21", price: "0.3289", qty: "373", side: "sell" },
    { time: "23:26:16", price: "0.3289", qty: "614", side: "sell" },
    { time: "23:26:12", price: "0.3290", qty: "712", side: "buy" },
    { time: "23:26:07", price: "0.3305", qty: "0.427", side: "buy" },
    { time: "23:26:04", price: "0.3290", qty: "949", side: "sell" },
    { time: "23:25:59", price: "0.3312", qty: "215", side: "buy" },
    { time: "23:25:55", price: "0.3298", qty: "1,024", side: "sell" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0b0e11]">
      <div className="p-3 border-b border-[#2b2f36]">
        <span className="text-sm font-bold">Filled</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="text-[10px] text-[#848e9c] uppercase sticky top-0 bg-[#0b0e11] z-10">
            <tr>
              <th className="px-4 py-2 font-normal">Time</th>
              <th className="px-4 py-2 font-normal text-right">Price (USD)</th>
              <th className="px-4 py-2 font-normal text-right">Quantity</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-mono">
            {trades.map((trade, i) => (
              <tr key={i} className="hover:bg-[#1e2329] cursor-default">
                <td className="px-4 py-1 text-[#848e9c]">{trade.time}</td>
                <td
                  className={`px-4 py-1 text-right font-medium ${trade.side === "buy" ? "text-green-500" : "text-red-500"}`}
                >
                  ${trade.price}
                </td>
                <td className="px-4 py-1 text-right text-[#eaecef]">
                  {trade.qty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeHistory;
