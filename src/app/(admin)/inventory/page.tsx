"use client"

import { useState } from "react"
import { Search, AlertTriangle, Plus, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type InventoryItem = {
  id: string
  sku: string
  name: string
  category: string
  stock: number
  threshold: number
  price: number
}

const MOCK_INVENTORY: InventoryItem[] = [
  { id: "1", sku: "SHF-001", name: "Dynamic Gold S200", category: "Shaft", stock: 12, threshold: 10, price: 3500 },
  { id: "2", sku: "SHF-002", name: "N.S.PRO 950GH neo S", category: "Shaft", stock: 4, threshold: 5, price: 4200 },
  { id: "3", sku: "GRP-001", name: "Golf Pride Tour Velvet", category: "Grip", stock: 2, threshold: 10, price: 1200 },
  { id: "4", sku: "GRP-002", name: "Iomic Sticky 2.3", category: "Grip", stock: 15, threshold: 5, price: 1500 },
  { id: "5", sku: "FER-001", name: "Standard Black Ferrule", category: "Ferrule", stock: 100, threshold: 20, price: 150 },
]

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = MOCK_INVENTORY.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Parts Inventory</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Part
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search parts by name or SKU..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price (¥)</TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" className="-mr-4 font-semibold hover:bg-transparent">
                  Stock
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => {
              const isLowStock = item.stock <= item.threshold

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={isLowStock ? "text-red-500" : ""}>{item.stock}</span>
                  </TableCell>
                  <TableCell>
                    {isLowStock ? (
                      <Badge variant="destructive" className="flex w-fit items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Low Stock
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        In Stock
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
            {filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No parts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
