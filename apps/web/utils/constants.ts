export type Stock = {
  name: string;
  icon: string;
  symbol: string;
  price: string;
  change: string;
  vol: string;
  marketCap: string;
  contractAddress: string;
  leverage: string;
};

export const stocks: Stock[] = [
  {
    name: "Nvidia Corp.",
    icon: "nvidia.svg",
    symbol: "NVDA",
    price: "142.12",
    change: "+2.36%",
    vol: "184.2M",
    marketCap: "1.2T",
    contractAddress: "0x...",
    leverage: "50x",
  },
  {
    name: "Tesla, Inc.",
    icon: "tesla.svg",
    symbol: "TSLA",
    price: "348.50",
    change: "-1.72%",
    vol: "82.1M",
    marketCap: "800B",
    contractAddress: "0x...",
    leverage: "5x",
  },
  {
    name: "Microsoft",
    icon: "microsoft.svg",
    symbol: "MSFT",
    price: "415.32",
    change: "+0.45%",
    vol: "22.8M",
    marketCap: "3.5T",
    contractAddress: "0x...",
    leverage: "50x",
  },
  {
    name: "Amazon.com",
    icon: "amazon.svg",
    symbol: "AMZN",
    price: "202.11",
    change: "+1.20%",
    vol: "38.5M",
    marketCap: "1.5T",
    contractAddress: "0x...",
    leverage: "50x",
  },
  {
    name: "Meta Platforms",
    icon: "meta.svg",
    symbol: "META",
    price: "582.01",
    change: "-0.85%",
    vol: "14.2M",
    marketCap: "1.2T",
    contractAddress: "0x...",
    leverage: "50x",
  },
];
