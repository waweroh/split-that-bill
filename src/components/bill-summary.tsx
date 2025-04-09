"use client";

import { Copy } from "lucide-react";
import type { Bill } from "@/types/bill";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface BillSummaryProps {
  bill: Bill;
  userTotals: {
    subtotal: number;
    tax: number;
    tip: number;
    total: number;
  };
  onSettleBill: () => void;
  message: string;
}

export default function BillSummary({
  bill,
  userTotals,
  onSettleBill,
  message,
}: BillSummaryProps) {
  const billTotal =
    bill.items.reduce((sum, item) => sum + item.price, 0) + bill.tax + bill.tip;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      // toast({
      //   title: "Copied to clipboard",
      //   description: "Your bill breakdown has been copied to clipboard",
      // });
      toast("Bill copied to clipboard")
    } catch (err) {
      // toast({
      //   title: "Failed to copy",
      //   description: "Please try again or copy manually",
      //   variant: "destructive",
      // });
      toast("Failed to copy")
    }
  };

  return (
    <div className='border-t'>
      <div className='p-4 space-y-2'>
        <div className='flex justify-between'>
          <span>Bill Subtotal:</span>
          <span>
            ${bill.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
          </span>
        </div>
        <div className='flex justify-between'>
          <span>Tax:</span>
          <span>${bill.tax.toFixed(2)}</span>
        </div>
        <div className='flex justify-between'>
          <span>Tip:</span>
          <span>${bill.tip.toFixed(2)}</span>
        </div>
        <div className='flex justify-between font-bold pt-2 border-t'>
          <span>Bill Total:</span>
          <span>${billTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className='bg-muted/20 p-4 space-y-4'>
        <h3 className='font-semibold'>Your Portion</h3>

        <div className='space-y-1'>
          <div className='flex justify-between'>
            <span>Subtotal:</span>
            <span>${userTotals.subtotal.toFixed(2)}</span>
          </div>
          <div className='flex justify-between'>
            <span>Tax:</span>
            <span>${userTotals.tax.toFixed(2)}</span>
          </div>
          <div className='flex justify-between'>
            <span>Tip:</span>
            <span>${userTotals.tip.toFixed(2)}</span>
          </div>
          <div className='flex justify-between font-bold pt-1 border-t'>
            <span>Your Total:</span>
            <span className='text-lg text-primary'>
              ${userTotals.total.toFixed(2)}
            </span>
          </div>
        </div>

        <Button
          className='w-full'
          onClick={onSettleBill}
          disabled={userTotals.total === 0}
        >
          Settle Your Bill
        </Button>

        {message && (
          <div className='mt-4 space-y-2'>
            <div className='flex items-center justify-between'>
              <h4 className='font-medium'>Your Bill Breakdown</h4>
              <Button variant='outline' size='icon' onClick={copyToClipboard}>
                <Copy className='h-4 w-4' />
              </Button>
            </div>
            <Textarea
              value={message}
              readOnly
              className='min-h-[150px] font-mono text-sm'
            />
          </div>
        )}
      </div>
    </div>
  );
}
