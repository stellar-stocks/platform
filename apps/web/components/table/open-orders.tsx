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

// Open Orders Data for DEX
const openOrders = [
  {
    id: "OO001",
    coin: "BTC/USDC",
    direction: "Buy",
    price: "45,200.50",
    size: "0.025",
    value: "$1,130.01",
  },
  {
    id: "OO002",
    coin: "ETH/USDC",
    direction: "Sell",
    price: "2,450.75",
    size: "1.5",
    value: "$3,676.13",
  },
  {
    id: "OO003",
    coin: "SOL/USDC",
    direction: "Buy",
    price: "105.30",
    size: "50",
    value: "$5,265.00",
  },
  {
    id: "OO004",
    coin: "BTC/USDC",
    direction: "Buy",
    price: "45,180.00",
    size: "0.1",
    value: "$4,518.00",
  },
  {
    id: "OO005",
    coin: "ETH/USDC",
    direction: "Sell",
    price: "2,460.00",
    size: "2.0",
    value: "$4,920.00",
  },
]

export function OpenOrdersTable() {
  return (
    <Table className="font-thin">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] font-thin">Order ID</TableHead>
          <TableHead className="font-thin">Coin Pair</TableHead>
          <TableHead className="font-thin">Direction</TableHead>
          <TableHead className="font-thin">Price</TableHead>
          <TableHead className="font-thin">Size</TableHead>
          <TableHead className="text-right font-thin">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {openOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-thin">{order.id}</TableCell>
            <TableCell>{order.coin}</TableCell>
            <TableCell className={order.direction === "Buy" ? "text-[#159564]" : "text-[#E63348]"}>{order.direction}</TableCell>
            <TableCell>{order.price}</TableCell>
            <TableCell>{order.size}</TableCell>
            <TableCell className="text-right">{order.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5} className="font-thin">Total Value</TableCell>
          <TableCell className="text-right font-thin">$19,509.14</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
