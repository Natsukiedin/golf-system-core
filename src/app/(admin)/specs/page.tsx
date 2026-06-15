"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { Save, Plus, Trash, ArrowDownToLine } from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SpecRow = {
  id: string
  clubType: string
  length: string
  weight: string
  swingWeight: string
  cpm: string
  loft: string
  lie: string
  notes: string
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const IRON_SET = ["#5", "#6", "#7", "#8", "#9", "PW"]

const DEFAULT_ROW: Omit<SpecRow, "id"> = {
  clubType: "",
  length: "",
  weight: "",
  swingWeight: "",
  cpm: "",
  loft: "",
  lie: "",
  notes: "",
}

export default function SpecsPage() {
  const [customerId, setCustomerId] = useState<string>("customer_1")
  const [rows, setRows] = useState<SpecRow[]>([
    { id: generateId(), ...DEFAULT_ROW, clubType: "#5" }
  ])
  const [isSaving, setIsSaving] = useState(false)

  // Add a single empty row
  const handleAddRow = () => {
    setRows([...rows, { id: generateId(), ...DEFAULT_ROW }])
  }

  // Pre-fill iron set (#5 - PW)
  const handleAddIronSet = () => {
    const newRows = IRON_SET.map((clubType) => ({
      id: generateId(),
      ...DEFAULT_ROW,
      clubType,
    }))
    setRows([...rows, ...newRows])
  }

  const handleRemoveRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id))
  }

  const updateRow = (id: string, field: keyof SpecRow, value: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  // Arrow key navigation for snappy data entry (like Excel)
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    const table = e.currentTarget.closest("table")
    if (!table) return

    let nextRow = rowIndex
    let nextCol = colIndex

    switch (e.key) {
      case "ArrowDown":
      case "Enter":
        e.preventDefault()
        nextRow = Math.min(rowIndex + 1, rows.length - 1)
        break
      case "ArrowUp":
        e.preventDefault()
        nextRow = Math.max(rowIndex - 1, 0)
        break
      case "ArrowRight":
        // Only if cursor is at the end of the text
        if (e.currentTarget.selectionStart === e.currentTarget.value.length) {
          e.preventDefault()
          nextCol = colIndex + 1
        }
        break
      case "ArrowLeft":
        // Only if cursor is at the beginning
        if (e.currentTarget.selectionStart === 0) {
          e.preventDefault()
          nextCol = colIndex - 1
        }
        break
      default:
        return
    }

    const nextInput = table.querySelector(
      `tr[data-row-index="${nextRow}"] td[data-col-index="${nextCol}"] input`
    ) as HTMLInputElement

    if (nextInput) {
      nextInput.focus()
      // Select all text like Excel does when moving cells
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === "ArrowUp") {
        setTimeout(() => nextInput.select(), 0)
      }
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Connect to backend
      // await createClubSpecsBulk(rows.map(r => ({ ...r, customer_id: customerId })))
      console.log("Saving specs:", rows)
      alert("Saved successfully! (Mock)")
    } catch (error) {
      console.error(error)
      alert("Error saving specs")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Club Specs (Karte)</h1>
        <div className="flex items-center gap-2">
          <Select value={customerId} onValueChange={setCustomerId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer_1">Tiger Woods</SelectItem>
              <SelectItem value="customer_2">Rory McIlroy</SelectItem>
              <SelectItem value="customer_3">Scottie Scheffler</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Specs"}
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={handleAddRow} className="bg-background">
          <Plus className="mr-2 h-4 w-4" />
          Add Row
        </Button>
        <Button variant="outline" onClick={handleAddIronSet} className="bg-background">
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Quick Add Iron Set (#5-PW)
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table className="w-full min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">Club</TableHead>
              <TableHead className="w-[120px]">Length (in)</TableHead>
              <TableHead className="w-[120px]">Weight (g)</TableHead>
              <TableHead className="w-[120px]">Swing Wt.</TableHead>
              <TableHead className="w-[120px]">CPM</TableHead>
              <TableHead className="w-[120px]">Loft (°)</TableHead>
              <TableHead className="w-[120px]">Lie (°)</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={row.id} data-row-index={rowIndex} className="hover:bg-transparent">
                <TableCell className="p-1" data-col-index={0}>
                  <Input
                    value={row.clubType}
                    onChange={(e) => updateRow(row.id, "clubType", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 0)}
                    className="h-10 md:h-8 border-0 bg-transparent rounded-none focus-visible:ring-1 focus-visible:ring-inset text-center md:text-left"
                    placeholder="#5"
                  />
                </TableCell>
                <TableCell className="p-1" data-col-index={1}>
                  <Input
                    value={row.length}
                    onChange={(e) => updateRow(row.id, "length", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 1)}
                    className="h-10 md:h-8 border-0 bg-transparent rounded-none focus-visible:ring-1 focus-visible:ring-inset text-center md:text-left"
                    placeholder="38.0"
                  />
                </TableCell>
                <TableCell className="p-1" data-col-index={2}>
                  <Input
                    value={row.weight}
                    onChange={(e) => updateRow(row.id, "weight", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 2)}
                    className="h-10 md:h-8 border-0 bg-transparent rounded-none focus-visible:ring-1 focus-visible:ring-inset text-center md:text-left"
                    placeholder="410"
                  />
                </TableCell>
                <TableCell className="p-1" data-col-index={3}>
                  <Input
                    value={row.swingWeight}
                    onChange={(e) => updateRow(row.id, "swingWeight", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 3)}
                    className="h-10 md:h-8 border-0 bg-transparent rounded-none focus-visible:ring-1 focus-visible:ring-inset text-center md:text-left"
                    placeholder="D2"
                  />
                </TableCell>
                <TableCell className="p-1" data-col-index={4}>
                  <Input
                    value={row.cpm}
                    onChange={(e) => updateRow(row.id, "cpm", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 4)}
                    className="h-10 md:h-8 border-0 bg-transparent rounded-none focus-visible:ring-1 focus-visible:ring-inset text-center md:text-left"
                    placeholder="310"
                  />
                </TableCell>
                <TableCell className="p-1" data-col-index={5}>
                  <Input
                    value={row.loft}
                    onChange={(e) => updateRow(row.id, "loft", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 5)}
                    className="h-10 md:h-8 border-0 bg-transparent rounded-none focus-visible:ring-1 focus-visible:ring-inset text-center md:text-left"
                    placeholder="26.0"
                  />
                </TableCell>
                <TableCell className="p-1" data-col-index={6}>
                  <Input
                    value={row.lie}
                    onChange={(e) => updateRow(row.id, "lie", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 6)}
                    className="h-10 md:h-8 border-0 bg-transparent rounded-none focus-visible:ring-1 focus-visible:ring-inset text-center md:text-left"
                    placeholder="61.5"
                  />
                </TableCell>
                <TableCell className="p-1" data-col-index={7}>
                  <Input
                    value={row.notes}
                    onChange={(e) => updateRow(row.id, "notes", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, 7)}
                    className="h-10 md:h-8 border-0 bg-transparent rounded-none focus-visible:ring-1 focus-visible:ring-inset"
                    placeholder="..."
                  />
                </TableCell>
                <TableCell className="p-1 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                    onClick={() => handleRemoveRow(row.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md border">
        <strong>Tip:</strong> Use <kbd className="px-1.5 py-0.5 border rounded-md bg-background text-xs">Arrow Keys</kbd> or <kbd className="px-1.5 py-0.5 border rounded-md bg-background text-xs">Enter</kbd> to navigate quickly between cells.
      </div>
    </div>
  )
}
