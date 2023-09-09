import Link from "next/link";

import {
    Card,
    Grid,
    Title,
    Text,
    Tab,
    TabList,
    TabGroup,
    TabPanel,
    TabPanels,
  } from "@tremor/react";

export default function AccountLayout(props: { children: React.ReactNode }) {
  return (
    <div className="py-8 px-4 max-w-screen-xl lg:px-6 flex flex-col justify-center items-center">
        <Title>Account Settings</Title>

      <TabGroup className="mt-6">
        <TabList>
          <Link href="/account/profile"><Tab>Profile</Tab></Link>
          <Link href="/account/password"><Tab>Password</Tab></Link>
          <Link href="/account/billing"><Tab>Billing</Tab></Link>
        </TabList>
        <TabPanels>
          {props.children}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
