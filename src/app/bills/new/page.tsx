"use client"
import CreateBillForm from "@/components/create-bill-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Check if Convex is available
let isConvexAvailable = true
try {
  require("convex/react")
  require("@/convex/_generated/api")
} catch (error) {
  console.warn("Convex not fully set up:", error)
  isConvexAvailable = false
}

export default function NewBillPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Create New Bill</h1>

      {!isConvexAvailable ? (
        <Card>
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
      ) : (
        <CreateBillForm />
      )}
    </div>
  )
}
