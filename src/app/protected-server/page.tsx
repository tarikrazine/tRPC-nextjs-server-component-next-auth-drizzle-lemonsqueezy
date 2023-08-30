import { redirect } from "next/navigation"
import { headers } from "next/headers"

import { getSession } from "next-auth/react"

import { serverClient } from "../_trpc/serverClient"

export default async function ProtectedPage() {
    const session = await getSession({
        req: {
          headers: Object.fromEntries(headers().entries()),
        },
      });

    if (!session) {
        return redirect("/login")
    }

    const notes = await (await serverClient()).notes.list()

    console.log(notes)
    
    return (
        <div>Protected Server Route</div>
    )
}