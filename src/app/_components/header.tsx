import Link from "next/link";

import { UserPlus2 } from "lucide-react";

import { Button } from "./ui/button";

function Header() {
  return (
    <div className="flex-1 space-y-6 py-8 px-4 mx-auto max-w-screen-xl lg:py-32 lg:px-6">
      <div className="flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
        BlogWiz AI a SAAS Boilerplate
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          The BlogWiz AI SAAS Boilerplate includes tRPC, Next.js Server Component, Next-auth, Drizzle, Shadcn/ui, Lemon Squeezy
        </p>
        <div className="space-x-4 flex justify-center items-center">
          <Link href="/register">
            <Button size={"lg"}>
              <UserPlus2 className="mr-2" /> <span>Create Account</span>
            </Button>
          </Link>
          <a
            href="https://github.com/tarikrazine/tRPC-nextjs-server-component-next-auth-drizzle"
            target="_blank"
          >
            <Button variant={"secondary"} size={"lg"}>
              Github
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Header;
