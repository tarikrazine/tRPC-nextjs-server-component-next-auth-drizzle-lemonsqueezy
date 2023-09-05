"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/app/_components/ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

type Checked = DropdownMenuCheckboxItemProps["checked"];

function AvatarProfile() {
  const { data: session } = useSession();

  async function logout() {
    try {
      await signOut();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar>
              <AvatarImage
                src={session?.user.image!}
                alt={session?.user.name!}
              />
              <AvatarFallback>
                {session?.user.name
                  ?.split(" ")
                  .map((name) => name.at(0)?.toUpperCase())}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{session?.user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
              {session?.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default AvatarProfile;
