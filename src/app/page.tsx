import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Bill Splitter</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome to Bill Splitter</CardTitle>
          <CardDescription>
            The easiest way to split bills with friends and keep track of who owes what.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">With Bill Splitter, you can:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Create bills with itemized entries</li>
            <li>Select which items you're responsible for</li>
            <li>Track how much you've paid</li>
            <li>Share bills with friends</li>
            <li>See your remaining balance</li>
          </ul>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/bills">View Bills</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/bills/new">Create New Bill</Link>
          </Button>
        </CardFooter>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>
          Note: This application uses Convex for real-time data synchronization. Make sure you have set up your Convex
          environment correctly.
        </p>
      </div>
    </main>
  )
}
