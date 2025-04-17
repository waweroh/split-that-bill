"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

// Try to import from Convex, but handle the case where it might not be available
let useQuery: any
try {
  useQuery = require("convex/react").useQuery
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

export default function BillsPage() {
  const [isConvexAvailable, setIsConvexAvailable] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [bills, setBills] = useState<any>(null) // Initialize bills state

  // Check if Convex is properly set up
  useEffect(() => {
    if (!useQuery || !api) {
      setIsConvexAvailable(false)
      setIsLoading(false)
    }
  }, [])

  // Fetch bills using useQuery hook inside useEffect
  useEffect(() => {
    if (isConvexAvailable && useQuery && api) {
      const fetchBills = async () => {
        setIsLoading(true)
        try {
          const fetchedBills = await useQuery(api.bills.getBills)
          setBills(fetchedBills)
        } catch (error) {
          console.error("Error fetching bills:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchBills()
    }
  }, [isConvexAvailable, useQuery, api])

  // Show setup instructions if Convex is not available
  if (!isConvexAvailable) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Your Bills</h1>
          <Button asChild>
            <Link href="/bills/new">Create New Bill</Link>
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-amber-600">Convex Setup Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The Convex backend is not fully set up yet. Please follow these steps to complete the setup:
            </p>
            <ol className="list-decimal pl-5 mb-4 space-y-2">
              <li>
                Run <code className="bg-gray-100 px-1 rounded">npx convex init</code> to create a new Convex deployment
              </li>
              <li>
                Run <code className="bg-gray-100 px-1 rounded">npx convex dev</code> to start the Convex development
                server
              </li>
              <li>Refresh this page after the setup is complete</li>
            </ol>
            <p className="text-sm text-gray-600 mt-4">
              These steps will generate the necessary API files and connect your application to the Convex backend.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Placeholder cards */}
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-40 opacity-50">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Your Bills</h1>
          <Button asChild>
            <Link href="/bills/new">Create New Bill</Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Loading bills...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Your Bills</h1>
        <Button asChild>
          <Link href="/bills/new">Create New Bill</Link>
        </Button>
      </div>

      {!bills || bills.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No bills found</p>
          <Button asChild>
            <Link href="/bills/new">Create Your First Bill</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bills.map((bill: any) => (
            <Link key={bill._id} href={`/bills/${bill._id}`}>
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{bill.restaurant}</CardTitle>
                  <p className="text-sm text-muted-foreground">{new Date(bill.date).toLocaleDateString()}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">${bill.totalAmount.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(bill.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        bill.status === "active"
                          ? "bg-blue-100 text-blue-800"
                          : bill.status === "settled"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {bill.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
