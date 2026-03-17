"use client"

import { useEffect } from "react"
import { getBoards } from "@/lib/api/boards"

export default function DevPage() {

  useEffect(() => {

    async function test() {
      const boards = await getBoards("user_123")
      console.log("Boards:", boards)
    }

    test()

  }, [])

  return <div>API test page</div>
}