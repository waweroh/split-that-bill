"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Caught error:", event.error)
      setError(event.error)
      setHasError(true)
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg border">
          <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>

          {error && error.message.includes("Convex") && (
            <div className="mb-4">
              <p className="mb-2">There was an error connecting to Convex:</p>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">{error.message}</pre>

              <div className="mt-4 space-y-2">
                <p className="font-medium">Possible solutions:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Make sure you've run <code className="bg-gray-100 px-1 rounded">npx convex init</code>
                  </li>
                  <li>Check that your NEXT_PUBLIC_CONVEX_URL environment variable is set</li>
                  <li>
                    Ensure <code className="bg-gray-100 px-1 rounded">npx convex dev</code> is running
                  </li>
                </ul>
              </div>
            </div>
          )}

          {(!error || !error.message.includes("Convex")) && (
            <p className="mb-4">An unexpected error occurred. Please try refreshing the page.</p>
          )}

          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
