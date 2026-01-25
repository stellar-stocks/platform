import React from "react";

export default function Footer() {
  return (
    <footer className="h-6 bg-[#181a20] border-t border-[#2b2f36] flex items-center px-3 text-[10px] text-[#848e9c] justify-between">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Real-time Feed Connected
        </span>
        <span>Account: TRA-9X2...K4</span>
      </div>
      <div className="flex items-center gap-4 uppercase font-bold tracking-tighter text-[9px]">
        <span>Institutional trading</span>
        <span>Help center</span>
        <span>API docs</span>
      </div>
    </footer>
  );
}
