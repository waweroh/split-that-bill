import React from "react"
import { ConvexReactClient } from "convex/react"
import { ConvexProvider } from "convex/react"

// Improved debugging and error handling for Convex initialization
const initializeConvexClient = () => {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      // During server-side rendering, return null
      // The client will initialize on the client side
      return null
    }

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

    if (!convexUrl) {
      console.error(
        "Missing NEXT_PUBLIC_CONVEX_URL environment variable. Please check your .env.local file or environment variables.",
      )
      return null
    }

    // Initialize the client with the URL
    return new ConvexReactClient(convexUrl)
  } catch (error) {
    console.error("Failed to initialize Convex client:", error)
    return null
  }
}

// Initialize the Convex client
export const convex = initializeConvexClient()

// Wrapper component for Convex with improved error handling
export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // If we're in server-side rendering or if client initialization failed
  if (typeof window === "undefined" || convex === null) {
    // During SSR, render a placeholder that will be replaced on the client
    if (typeof window === "undefined") {
      return <React.Fragment>{children}</React.Fragment>
    }

    // On the client, if we don't have a client, show an error message
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-red-50">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg border border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-4">Configuration Error</h2>
          <p className="mb-4">The Convex URL environment variable is missing or invalid. Please make sure you have:</p>
          <ol className="list-decimal pl-5 mb-4 space-y-2">
            <li>
              Created a Convex deployment with <code className="bg-gray-100 px-1 rounded">npx convex init</code>
            </li>
            <li>Added the NEXT_PUBLIC_CONVEX_URL environment variable to your project</li>
            <li>Restarted your development server</li>
          </ol>
          <p className="text-sm text-gray-600">
            If running locally, make sure to run <code className="bg-gray-100 px-1 rounded">npx convex dev</code> and
            check that your .env.local file is populated.
          </p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Environment variable status: {process.env.NEXT_PUBLIC_CONVEX_URL ? "Defined but invalid" : "Missing"}
            </p>
            <p className="text-sm text-gray-600 mt-1">Check the browser console for more detailed error information.</p>
          </div>
        </div>
      </div>
    )
  }

  // Otherwise, render the provider with the client
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
