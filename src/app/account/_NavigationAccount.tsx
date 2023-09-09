"use client";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/app/_components/ui/navigation-menu";

function NavigationAccount() {
  return (
    <NavigationMenu className="max-h-10 flex justify-center items-center w-full bg-red-800">
      <NavigationMenuList className="">
        <NavigationMenuItem className="bg-red-400">
        <Link href="/account/profile" legacyBehavior passHref className="">
          <NavigationMenuLink className={`${navigationMenuTriggerStyle()}`}>Profile</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="">
        <Link href="/account/profile" legacyBehavior passHref className="">
          <NavigationMenuLink className={`${navigationMenuTriggerStyle()}`}>Password</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="">
        <Link href="/account/profile" legacyBehavior passHref className="">
          <NavigationMenuLink className={`${navigationMenuTriggerStyle()}`}>Billing</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavigationAccount;
