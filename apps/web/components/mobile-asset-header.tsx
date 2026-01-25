import React from "react";

interface MobileAssetHeaderProps {
  symbol: string;
  icon?: string;
  onClick?: () => void;
}

const MobileAssetHeader: React.FC<MobileAssetHeaderProps> = ({
  symbol,
  icon,
  onClick,
}) => {
  const ticker = symbol.split(":").pop() || symbol;

  return (
    <div
      className="h-16 border-b border-[#1e2329] flex items-center px-2 justify-between cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-8 w-full lg:w-auto">
        <div className="flex items-center gap-3">
          <img
            className="mx-2"
            src={`/icons/${icon}`}
            alt={ticker}
            width={32}
            height={32}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-[#eaecef]">
                {ticker}
              </span>
              <span className="text-[9px] px-2 py-0.5 bg-[#1e2329] border border-[#2b2f36] rounded-md font-bold text-[#848e9c] uppercase tracking-widest">
                PERP
              </span>
            </div>
            <div className="text-[10px] text-[#848e9c] font-medium">
              Nasdaq Global Select
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAssetHeader;
