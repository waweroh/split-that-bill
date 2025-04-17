"use client"

import type React from "react"
import { Copy } from "lucide-react"
import type { Bill } from "@/types/bill"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
// import { toast } from "../hooks/use-toast"
// import { useToast } from "@/components/hooks/use-toast";
import { Input } from "@/components/ui/input"
// import { ToastAction } from "@/components/ui/toast";

interface BillSummaryProps {
  bill: Bill
  userTotals: {
    subtotal: number
    amountPaid: number
    balance: number
  }
  onSettleBill: () => void
  message: string
  onAmountPaidChange: (amount: number) => void
}

export default function BillSummary({ bill, userTotals, onSettleBill, message, onAmountPaidChange }: BillSummaryProps) {
  const billTotal = bill.items.reduce((sum, item) => sum + item.price, 0)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0
    onAmountPaidChange(value)
  }

  // const copyToClipboard = async () => {
  //   try {
  //     await navigator.clipboard.writeText(message)
  //     toast({
  //       title: "Copied to clipboard",
  //       description: "Your bill breakdown has been copied to clipboard",
  //     })
  //   } catch (err) {
  //     toast({
  //       title: "Failed to copy",
  //       description: "Please try again or copy manually",
  //       variant: "destructive",
  //     })
  //   }
  // }

  return (
    <div className="border-t">
      <div className="p-4">
        <div className="flex justify-between font-bold">
          <span>Bill Total:</span>
          <span>${bill.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-muted/20 p-4 space-y-4">
        <h3 className="font-semibold">Your Portion</h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${userTotals.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Amount Paid:</span>
            <div className="w-24">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={userTotals.amountPaid.toString()}
                onChange={handleAmountChange}
                className="text-right"
              />
            </div>
          </div>

          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Balance:</span>
            <span
              className={`text-lg ${userTotals.balance < 0 ? "text-green-600" : userTotals.balance > 0 ? "text-red-600" : "text-primary"}`}
            >
              ${userTotals.balance.toFixed(2)}
            </span>
          </div>
        </div>

        <Button className="w-full" onClick={onSettleBill} disabled={userTotals.subtotal === 0}>
          Settle Your Bill
        </Button>

        {message && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Your Bill Breakdown</h4>
              {/* <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button> */}
            </div>
            <Textarea value={message} readOnly className="min-h-[150px] font-mono text-sm" />
          </div>
        )}
      </div>
    </div>
  )
}
