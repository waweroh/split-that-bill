"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import BillSplitter from "@/components/bill-splitter";
import Link from "next/link";

// Try to import from Convex, but handle the case where it might not be available
let useQuery: any, useMutation: any;
try {
  const convexReact = require("convex/react");
  useQuery = convexReact.useQuery;
  useMutation = convexReact.useMutation;
} catch (error) {
  console.warn("Convex not available:", error);
}

// Try to import the API, but handle the case where it might not be available
let api: any;
try {
  api = require("@/convex/_generated/api").api;
} catch (error) {
  console.warn("Convex API not available:", error);
}

// Try to import the session utility
let useSessionId: any;
try {
  useSessionId = require("@/lib/session").useSessionId;
} catch (error) {
  console.warn("Session utility not available:", error);
  // Provide a fallback
  useSessionId = () => ({
    sessionId: null,
    userName: "Guest",
    updateUserName: () => {},
  });
}

export default function BillPage() {
  const { id } = useParams();
  const router = useRouter();
  const billId = id as string;
  const { sessionId, userName, updateUserName } = useSessionId();
  const [tempUserName, setTempUserName] = useState("");
  const [isConvexAvailable, setIsConvexAvailable] = useState(true);

  // Check if Convex is properly set up
  useEffect(() => {
    if (!useQuery || !api) {
      setIsConvexAvailable(false);
    }
  }, []);

  // Fetch data using useQuery conditionally
  const bill = useQuery(api?.bills?.getBill, { billId });
  const userSelections = useQuery(api?.bills?.getUserSelections, {
    billId,
    userId: sessionId,
  });
  const payment = useQuery(api?.bills?.getPayment, {
    billId,
    userId: sessionId,
  });

  const updateSelection = useMutation(api?.bills?.updateSelection);
  const updatePayment = useMutation(api?.bills?.updatePayment);

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [amountPaid, setAmountPaid] = useState(0);

  // Initialize selections and payment from the database
  useEffect(() => {
    if (userSelections) {
      setSelectedItemIds(userSelections);
    }
  }, [userSelections]);

  useEffect(() => {
    if (payment !== undefined) {
      setAmountPaid(payment);
    }
  }, [payment]);

  useEffect(() => {
    if (userName) {
      setTempUserName(userName);
    }
  }, [userName]);

  // Handle selection changes
  const handleToggleSelection = useCallback(
    async (itemId: string) => {
      if (!sessionId || !updateSelection) return;

      const isSelected = selectedItemIds.includes(itemId);
      const newSelectedIds = isSelected
        ? selectedItemIds.filter((id) => id !== itemId)
        : [...selectedItemIds, itemId];

      setSelectedItemIds(newSelectedIds);

      await updateSelection({
        billId,
        userId: sessionId,
        itemId,
        selected: !isSelected,
      });
    },
    [billId, selectedItemIds, sessionId, updateSelection]
  );

  // Handle payment changes
  const handleAmountPaidChange = useCallback(
    async (amount: number) => {
      if (!sessionId || !updatePayment) return;

      setAmountPaid(amount);

      await updatePayment({
        billId,
        userId: sessionId,
        amount,
      });
    },
    [billId, sessionId, updatePayment]
  );

  const handleUpdateUserName = () => {
    if (tempUserName.trim() && updateUserName) {
      updateUserName(tempUserName.trim());
    }
  };

  // Show setup instructions if Convex is not available
  if (!isConvexAvailable) {
    return (
      <div className='container mx-auto p-4 md:p-8'>
        <h1 className='text-2xl md:text-3xl font-bold mb-6'>Bill Details</h1>

        <Card className='mb-8'>
          <CardHeader>
            <CardTitle className='text-amber-600'>
              Convex Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='mb-4'>
              The Convex backend is not fully set up yet. Please follow these
              steps to complete the setup:
            </p>
            <ol className='list-decimal pl-5 mb-4 space-y-2'>
              <li>
                Run{" "}
                <code className='bg-gray-100 px-1 rounded'>
                  npx convex init
                </code>{" "}
                to create a new Convex deployment
              </li>
              <li>
                Run{" "}
                <code className='bg-gray-100 px-1 rounded'>npx convex dev</code>{" "}
                to start the Convex development server
              </li>
              <li>Refresh this page after the setup is complete</li>
            </ol>
            <p className='text-sm text-gray-600 mt-4'>
              These steps will generate the necessary API files and connect your
              application to the Convex backend.
            </p>
            <div className='mt-6'>
              <Button asChild>
                <Link href='/'>Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bill || !sessionId) {
    return (
      <div className='container mx-auto p-4 md:p-8'>
        <h1 className='text-2xl md:text-3xl font-bold mb-6'>Loading Bill...</h1>
        <div className='animate-pulse space-y-4'>
          <div className='h-10 bg-gray-200 rounded w-1/3'></div>
          <div className='h-40 bg-gray-200 rounded'></div>
          <div className='h-60 bg-gray-200 rounded'></div>
        </div>
      </div>
    );
  }

  // Convert Convex data to the format expected by BillSplitter
  const billData = {
    restaurant: bill.restaurant,
    date: bill.date,
    items: bill.items.map((item: any) => ({
      id: item._id,
      name: item.name,
      price: item.price,
    })),
    tax: bill.tax || 0,
    tip: bill.tip || 0,
  };

  return (
    <div className='container mx-auto p-4 md:p-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold'>
          Bill from {bill.restaurant}
        </h1>
        <Button variant='outline' asChild>
          <Link href='/bills'>Back to Bills</Link>
        </Button>
      </div>

      <div className='mb-6'>
        <Card>
          <CardHeader>
            <CardTitle>Your Identity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-end gap-4'>
              <div className='flex-1'>
                <Label htmlFor='userName' className='mb-2 block'>
                  Your Name
                </Label>
                <Input
                  id='userName'
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  placeholder='Enter your name'
                />
              </div>
              <Button onClick={handleUpdateUserName}>Update</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BillSplitter
        bill={{
          restaurant: billData.restaurant,
          date: billData.date,
          items: billData.items,
          tax: billData.tax,
          tip: billData.tip,
        }}
        selectedItemIds={selectedItemIds}
        amountPaid={amountPaid}
        onToggleSelection={handleToggleSelection}
        onAmountPaidChange={handleAmountPaidChange}
      />

      <div className='mt-6 text-sm text-muted-foreground'>
        <p>
          Share this page URL with your friends to split the bill together. Each
          person can select their items and track their payment.
        </p>
      </div>
    </div>
  );
}
