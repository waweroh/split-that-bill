"use client";

import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RunningTotalProps {
  itemCount: number;
  total: number;
}

export default function RunningTotal({ itemCount, total }: RunningTotalProps) {
  if (total === 0) return null;

  return (
    <div className='sticky bottom-0 w-full bg-background border-t p-3 shadow-lg flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <ShoppingCart className='h-5 w-5' />
        <Badge variant='secondary'>
          {itemCount} {itemCount === 1 ? "item" : "items"} selected
        </Badge>
      </div>
      <div className='font-bold text-lg'>
        Running Total: <span className='text-primary'>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
