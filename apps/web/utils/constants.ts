export type Stock = {
  name: string;
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
    name: "Apple Inc.",
    symbol: "AAPL",
    price: "228.24",
    change: "+1.10%",
    vol: "52.4M",
    marketCap: "2.8T",
    contractAddress: "0x...",
    leverage: "50x",
  },
  {
    name: "Nvidia Corp.",
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
    symbol: "META",
    price: "582.01",
    change: "-0.85%",
    vol: "14.2M",
    marketCap: "1.2T",
    contractAddress: "0x...",
    leverage: "50x",
  },
  {
    name: "Google Class A",
    symbol: "GOOGL",
    price: "188.15",
    change: "+0.01%",
    vol: "26.5M",
    marketCap: "2.5T",
    contractAddress: "0x...",
    leverage: "50x",
  },
  {
    name: "Advanced Micro",
    symbol: "AMD",
    price: "154.22",
    change: "-2.15%",
    vol: "45.1M",
    marketCap: "2.1T",
    contractAddress: "0x...",
    leverage: "50x",
  },
  {
    name: "Palantir Tech",
    symbol: "PLTR",
    price: "64.12",
    change: "+5.42%",
    vol: "112.4M",
    marketCap: "1.1T",
    contractAddress: "0x...",
    leverage: "50x",
  },
];
