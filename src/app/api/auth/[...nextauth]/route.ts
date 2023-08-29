import { type NextRequest } from "next/server";

import NextAuth from "next-auth";

import { authOptions } from "./_options";

interface Context {
  params: { nextauth: string[] };
}

async function handler(request: NextRequest, context: Context) {
  return NextAuth(...authOptions(request, context));
}

export { handler as GET, handler as POST };
