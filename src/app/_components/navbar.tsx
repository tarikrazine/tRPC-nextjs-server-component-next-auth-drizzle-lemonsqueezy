"use client";

import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut, useSession } from "next-auth/react";

import { ModeToggle } from "./reusable/modeToggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/app/_components/ui/navigation-menu";
import { Button } from "./ui/button";

function NavBar() {

  const { data: session } = useSession()

  async function logout() {
    try {
        await signOut()
    } catch(error) {
        console.log(error)
    }
}

  return (
    <div className="container z-40 bg-background">
      <div className="flex h-20 items-center justify-between py-6">
        <div className="flex gap-6 md:gap-10">
          <Link className="hidden items-center space-x-2 md:flex" href="/">
            <span className="hidden font-extrabold text-xl leading-4 sm:inline-block">
            tRPC-next
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/protected-server" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Protected Server
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/protected-client" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Protected Client
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <nav className="flex justify-center items-center space-x-4">
          <ModeToggle />
          {
            session ? <Button onClick={logout} variant="link" size={"sm"}>Logout</Button> : <Link href="/login"><Button variant="link" size={"sm"}>Login</Button></Link>
          }
        </nav>
      </div>
    </div>
  );
}

export default NavBar;
