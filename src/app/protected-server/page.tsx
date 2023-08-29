import { redirect } from "next/navigation"
import { headers } from "next/headers"

import { getSession } from "next-auth/react"

import { serverClient } from "../_trpc/serverClient"

export default async function ProtectedPage() {
    const session = getSession({
        req: {
          headers: Object.fromEntries(headers().entries()),
        },
      });

    if (!session) {
        return redirect("/login")
    }

    const notes = await serverClient.notes.list()

    console.log(notes)
    
    return (
        <div>Protected Route</div>
    )
}