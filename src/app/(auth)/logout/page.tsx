import { redirect } from "next/navigation"

import Logout from "@/app/_components/logout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { getSession } from "next-auth/react";
import { headers } from "next/headers";

export default async function LogoutPage() {
  const session = await getSession({
    req: {
      headers: Object.fromEntries(headers().entries()),
    },
  });

    if (!session) {
        return redirect("/login")
    }

  return (
    <section className="h-full flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="flex-1 rounded-md max-w-xl py-8 px-2">
        <CardHeader>
          <CardTitle>Logout</CardTitle>
          <CardDescription>Are you sure you want to Log out?</CardDescription>
        </CardHeader>
        <CardContent>
            <Logout />
        </CardContent>
      </Card>
    </section>
  );
}
