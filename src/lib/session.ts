"use client"

import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

// Get or create a session ID for the current user
export function useSessionId() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    // Try to get existing session ID from localStorage
    let id = localStorage.getItem("billSplitterSessionId")
    let name = localStorage.getItem("billSplitterUserName")

    // If no session ID exists, create one
    if (!id) {
      id = uuidv4()
      localStorage.setItem("billSplitterSessionId", id)
    }

    // If no user name exists, use a default
    if (!name) {
      name = `User-${id.substring(0, 4)}`
      localStorage.setItem("billSplitterUserName", name)
    }

    setSessionId(id)
    setUserName(name)
  }, [])

  const updateUserName = (newName: string) => {
    localStorage.setItem("billSplitterUserName", newName)
    setUserName(newName)
  }

  return { sessionId, userName, updateUserName }
}
