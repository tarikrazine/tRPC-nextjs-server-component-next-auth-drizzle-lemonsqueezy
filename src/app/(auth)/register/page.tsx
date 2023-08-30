import Register from "@/app/_components/register";

import { redirect } from "next/navigation";
import { getSession } from "next-auth/react";
import { headers } from "next/headers";

export default async function LoginPage() {
 
  const session = await getSession({
    req: {
      headers: Object.fromEntries(headers().entries()),
    },
  });

  if (session) {
    return redirect('/')
  }

  return (
    <section className="flex-1 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <Register />
    </section>
  );
}
