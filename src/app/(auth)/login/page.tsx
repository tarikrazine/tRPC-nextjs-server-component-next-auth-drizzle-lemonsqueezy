import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

import { getServerSession } from "next-auth";

import Login from "@/app/_components/login";

import { authOptions } from "@/app/api/auth/[...nextauth]/_options";
import { getSession } from "next-auth/react";

export default async function LoginPage() {
  const session = await getSession({
    req: {
      headers: Object.fromEntries(headers().entries()),
    },
  });

  if (session) {
    return redirect("/");
  }

  return (
    <section className="flex-1 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <Login />
    </section>
  );
}
