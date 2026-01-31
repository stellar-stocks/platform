import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Trade History Data
const tradeHistory = [
  {
    id: "TH001",
    time: "2026-01-31 10:30",
    coin: "BTC/USDC",
    direction: "Buy",
    price: "45,200.50",
    size: "0.025",
    value: "$1,130.01",
    fee: "$1.13",
    pnl: "+$25.50",
  },
  {
    id: "TH002",
    time: "2026-01-31 11:15",
    coin: "ETH/USDC",
    direction: "Sell",
    price: "2,450.75",
    size: "1.5",
    value: "$3,676.13",
    fee: "$3.68",
    pnl: "-$12.30",
  },
  {
    id: "TH003",
    time: "2026-01-30 14:45",
    coin: "SOL/USDC",
    direction: "Buy",
    price: "105.30",
    size: "50",
    value: "$5,265.00",
    fee: "$5.27",
    pnl: "+$150.00",
  },
  {
    id: "TH004",
    time: "2026-01-30 16:20",
    coin: "BTC/USDC",
    direction: "Sell",
    price: "45,500.00",
    size: "0.1",
    value: "$4,550.00",
    fee: "$4.55",
    pnl: "+$32.00",
  },
]

export function TradeHistoryTable() {
  return (
    <Table className="font-thin">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] font-thin">ID</TableHead>
          <TableHead className="font-thin">Time</TableHead>
          <TableHead className="font-thin">Coin</TableHead>
          <TableHead className="font-thin">Dir</TableHead>
          <TableHead className="font-thin">Price</TableHead>
          <TableHead className="font-thin">Size</TableHead>
          <TableHead className="text-right font-thin">Value</TableHead>
          <TableHead className="text-right font-thin">Fee</TableHead>
          <TableHead className="text-right font-thin">PnL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tradeHistory.map((trade) => (
          <TableRow key={trade.id}>
            <TableCell className="font-thin">{trade.id}</TableCell>
            <TableCell>{trade.time}</TableCell>
            <TableCell>{trade.coin}</TableCell>
            <TableCell className={trade.direction === "Buy" ? "text-[#159564]" : "text-[#E63348]"}>{trade.direction}</TableCell>
            <TableCell>{trade.price}</TableCell>
            <TableCell>{trade.size}</TableCell>
            <TableCell className="text-right">{trade.value}</TableCell>
            <TableCell className="text-right">{trade.fee}</TableCell>
            <TableCell className={`text-right font-thin ${trade.pnl.startsWith('+') ? 'text-[#159564]' : 'text-[#E63348]'}`}>
              {trade.pnl}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6} className="font-thin">Total PnL</TableCell>
          <TableCell className="text-right font-thin" colSpan={3}>+$195.20</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
