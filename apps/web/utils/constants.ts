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

export const config = {
  // Public Ethereum Sepolia RPC and your private wallet key
  ETH_RPC_URL: process.env.RPC_URL || "https://ethereum-sepolia.publicnode.com",
  PRIVATE_KEY: process.env.PRIVATE_KEY,

  // Contract addresses on testnet
  X_RESERVE_CONTRACT: "008888878f94C0d87defdf0B07f46B93C1934442",
  ETH_USDC_CONTRACT: "1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",

  // Deposit parameters for Stacks
  STACKS_DOMAIN: 10003, // Stacks domain ID
  STACKS_RECIPIENT: "YOUR_STACKS_TESTNET_ADDRESS", // Address to receive minted USDCx on Stacks
  DEPOSIT_AMOUNT: "1.00",
  MAX_FEE: "0",
};

// --snip--

// ============ Contract ABIs ============
const X_RESERVE_ABI = [
  {
    name: "depositToRemote",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "value", type: "uint256" },
      { name: "remoteDomain", type: "uint32" },
      { name: "remoteRecipient", type: "bytes32" },
      { name: "localToken", type: "address" },
      { name: "maxFee", type: "uint256" },
      { name: "hookData", type: "bytes" },
    ],
    outputs: [],
  },
];

export const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "success", type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
  },
];
