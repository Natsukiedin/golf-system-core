"use client"

import { useState } from "react"
import { Search, Calculator, Receipt, CreditCard, Banknote } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type LineItem = {
  id: string
  description: string
  type: "Part" | "Labor"
  quantity: number
  unitPrice: number
}

const MOCK_ITEMS: LineItem[] = [
  { id: "1", description: "Dynamic Gold S200 Shaft", type: "Part", quantity: 6, unitPrice: 3500 },
  { id: "2", description: "Golf Pride Tour Velvet Grip", type: "Part", quantity: 6, unitPrice: 1200 },
  { id: "3", description: "Iron Re-shaft Labor (#5-PW)", type: "Labor", quantity: 6, unitPrice: 2000 },
  { id: "4", description: "Lie/Loft Adjustment", type: "Labor", quantity: 6, unitPrice: 500 },
]

export default function CheckoutPage() {
  const [items, setItems] = useState<LineItem[]>(MOCK_ITEMS)
  const [discount, setDiscount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card")

  const subtotalParts = items.filter(i => i.type === "Part").reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0)
  const subtotalLabor = items.filter(i => i.type === "Labor").reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0)
  const subtotal = subtotalParts + subtotalLabor
  const tax = Math.floor((subtotal - discount) * 0.10) // 10% tax
  const total = subtotal - discount + tax

  const handleCheckout = () => {
    // TODO: Connect to src/app/actions/pricing.ts and src/app/actions/tasks.ts
    alert(`Payment processed via ${paymentMethod === 'credit_card' ? 'Credit Card' : 'Cash'} for ¥${total.toLocaleString()}`)
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
        <div className="flex items-center gap-2">
          <Select defaultValue="T-1001">
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select Work Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="T-1001">T-1001: Iron Set Re-shaft</SelectItem>
              <SelectItem value="T-1002">T-1002: Driver Grip Change</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Invoice Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>Work Order: T-1001 | Customer: Tiger Woods</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${item.type === 'Part' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'}`}>
                          {item.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">¥{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">¥{(item.quantity * item.unitPrice).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Summary & Payment */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Parts Subtotal</span>
                <span>¥{subtotalParts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Labor Subtotal</span>
                <span>¥{subtotalLabor.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between gap-4 pt-2">
                <Label htmlFor="discount" className="text-muted-foreground">Discount (¥)</Label>
                <Input 
                  id="discount" 
                  type="number" 
                  className="w-24 h-8 text-right" 
                  value={discount || ""} 
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>

              <Separator />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>¥{(subtotal - discount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>¥{tax.toLocaleString()}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>¥{total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    type="button" 
                    variant={paymentMethod === 'credit_card' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('credit_card')}
                    className="w-full"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card
                  </Button>
                  <Button 
                    type="button" 
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('cash')}
                    className="w-full"
                  >
                    <Banknote className="mr-2 h-4 w-4" />
                    Cash
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full h-12 text-lg" onClick={handleCheckout}>
                <Receipt className="mr-2 h-5 w-5" />
                Complete Payment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
