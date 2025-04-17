"use client"

import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface GroupedItem {
  name: string
  price: number
  count: number
  ids: number[]
}

interface BillItemRowProps {
  groupedItem: GroupedItem
  selectedCount: number
  onOpenDetailView: () => void
  onToggleAll: (select: boolean) => void
}

export default function BillItemRow({ groupedItem, selectedCount, onOpenDetailView, onToggleAll }: BillItemRowProps) {
  const isPartiallySelected = selectedCount > 0 && selectedCount < groupedItem.count
  const isFullySelected = selectedCount === groupedItem.count

  const handleToggleAll = () => {
    onToggleAll(!isFullySelected)
  }

  return (
    <div className={`px-4 py-3 ${selectedCount > 0 ? "bg-primary/5" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {groupedItem.count === 1 ? (
            // Show checkbox only for single items
            <Button
              variant={isFullySelected ? "default" : "outline"}
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={handleToggleAll}
            >
              {isFullySelected && <Check className="h-4 w-4" />}
            </Button>
          ) : (
            // Show dropdown arrow for multiple items with improved visibility
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-md border-gray-300 bg-gray-100 hover:bg-gray-200"
              onClick={onOpenDetailView}
            >
              <ChevronDown className="h-4 w-4 text-gray-600" />
              <span className="sr-only">Select individual items</span>
            </Button>
          )}

          <div className="flex items-center gap-2">
            <span>{groupedItem.name}</span>
            {groupedItem.count > 1 && (
              <Badge variant="outline" className="ml-2">
                x{groupedItem.count}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <div className="font-medium">${groupedItem.price.toFixed(2)}</div>
        </div>
      </div>

      {isPartiallySelected && groupedItem.count > 1 && (
        <div className="mt-1 ml-9 text-sm text-muted-foreground">
          {selectedCount} of {groupedItem.count} selected
        </div>
      )}
    </div>
  )
}
