import Link from "next/link";

import {
    Title,
  } from "@tremor/react";

export default function AccountLayout(props: { children: React.ReactNode }) {
  return (
    <div className="py-8 px-4 max-w-screen-xl lg:px-6 flex flex-col justify-center items-center">
        <Title>Account Settings</Title>
          <Link href="/account/profile">Profile</Link>
          <Link href="/account/password">Password</Link>
          <Link href="/account/billing">Billing</Link>
    </div>
  );
}
