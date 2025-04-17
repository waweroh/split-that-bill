"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash } from "lucide-react"
import { useRouter } from "next/navigation"

// Try to import from Convex, but handle the case where it might not be available
let useMutationImport: any
try {
  useMutationImport = require("convex/react").useMutation
} catch (error) {
  console.warn("Convex not available:", error)
}

// Try to import the API, but handle the case where it might not be available
let api: any
try {
  api = require("@/convex/_generated/api").api
} catch (error) {
  console.warn("Convex API not available:", error)
}

// Try to import the session utility
let useSessionId: any
try {
  useSessionId = require("@/lib/session").useSessionId
} catch (error) {
  console.warn("Session utility not available:", error)
  // Provide a fallback
  useSessionId = () => ({ sessionId: "placeholder-session-id" })
}

export default function CreateBillForm() {
  const { sessionId } = useSessionId()
  // Move the hook call outside the conditional
  const createBill = useMutationImport ? useMutationImport(api?.bills?.createBill) : null
  const router = useRouter()

  const [restaurant, setRestaurant] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [items, setItems] = useState([{ name: "", price: 0, quantity: 1 }])

  const addItem = () => {
    setItems([...items, { name: "", price: 0, quantity: 1 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!restaurant || items.some((item) => !item.name)) {
      alert("Please fill in all required fields")
      return
    }

    if (!createBill) {
      alert("Convex is not fully set up yet. Please complete the setup and try again.")
      return
    }

    try {
      const billId = await createBill({
        restaurant,
        date,
        items,
        sessionId,
      })

      // Reset form
      setRestaurant("")
      setDate(new Date().toISOString().split("T")[0])
      setItems([{ name: "", price: 0, quantity: 1 }])

      // Navigate to the new bill
      router.push(`/bills/${billId}`)
    } catch (error) {
      console.error("Error creating bill:", error)
      alert("Failed to create bill. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Bill</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurant">Restaurant Name</Label>
              <Input id="restaurant" value={restaurant} onChange={(e) => setRestaurant(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Input
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => updateItem(index, "price", Number.parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                    min="1"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={!createBill}>
            Create Bill
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
