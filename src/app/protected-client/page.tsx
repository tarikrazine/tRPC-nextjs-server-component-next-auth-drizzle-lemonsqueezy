"use client"

import { redirect } from "next/navigation"

import { useSession } from "next-auth/react"

import { trpc } from "../_trpc/client"

export default function ProtectedPage() {
    const session = useSession();

    if (session.status === "unauthenticated") {
        return redirect("/login")
    }

    const { data } = trpc.notes.list.useQuery()

    console.log(data)
    
    return (
        <div>Protected client Route</div>
    )
}