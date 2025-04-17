import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ConvexClientProvider } from "@/lib/convex"
// import { ThemeProvider } from "@/components/theme-provider"
import ErrorBoundary from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Bill Splitter",
  description: "Split bills easily with friends",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ConvexClientProvider>
            {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
            {children}
            {/* </ThemeProvider> */}
          </ConvexClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
