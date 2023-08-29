"use client"

import { signOut } from "next-auth/react"

import { Button } from "@/app/_components/ui/button"
import { ExitIcon } from "@radix-ui/react-icons"

const Logout = () => {

    async function logout() {
        try {
            await signOut()
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <Button onClick={logout} className="flex justify-center items-center"><ExitIcon className="mr-2" /> <span>Log out</span> </Button>
    )
}

export default Logout