import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSession } from "next-auth/react";
import { JSDOM } from "jsdom";
import { Session, User } from "next-auth";

import { Button } from "./button";
import { env } from "@/env.mjs";
import { serverClient } from "@/app/_trpc/serverClient";

async function PricingPlan() {
  const session = await getSession({
    req: {
      headers: Object.fromEntries(headers().entries()),
    },
  });

  console.log("front", session)

  const productId = env.PRODUCT_ID;

  const { data: productVariants } = await (
    await serverClient()
  ).paymentSubscription.getProductVariants({ productId });

  if (!productVariants) {
    throw new Error("No product variants");
  }

  function createCheckoutLink({variantId, user}: {variantId: string, user: Session["user"] | null | undefined}) {
    const baseUrl = new URL(`https://backlinkgpt.lemonsqueezy.com/checkout/buy/${variantId}`)

    if (!user) return redirect('/login')

    const email = user.email
    const name = user.name ? user.name : undefined
    const userId = user?.id

    const url = new URL(baseUrl)
    url.searchParams.append('checkout[custom][user_id]', userId)
    if (email) url.searchParams.append('checkout[email]', email)
    if (name) url.searchParams.append('checkout[name]', name)

    return url.toString()
  }

  return (
    <section className="bg-primary-foreground">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Designed for business teams like yours
          </h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Elevate your blogging with BlogWiz AI, your content partner for
            creating exceptional blog posts. Powered by advanced AI, it
            effortlessly helps bloggers, content marketers, and writers produce
            high-quality, SEO-friendly articles.
          </p>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          {productVariants
            .map(({ attributes, id }) => {
              const dom = new JSDOM(attributes.description!);

              const document = dom.window.document;

              // the first paragraph becomes the description
              const description = document.querySelector("p")?.textContent;

              const features = Array.from(
                document.querySelectorAll("ul li p")
              ).map((li) => (li as HTMLElement).textContent);

              const price = attributes.price / 100;

              return (
                <div
                  key={`${id}-${attributes.name}`}
                  className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white"
                >
                  <h3 className="mb-4 text-2xl font-semibold">
                    {attributes.name}
                  </h3>
                  <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                    {description}
                  </p>
                  <div className="flex justify-center items-baseline my-8">
                    <span className="mr-2 text-5xl font-extrabold">
                      ${price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      /{attributes.interval}
                    </span>
                  </div>
                  <ul role="list" className="mb-8 space-y-4 text-left">
                    {features.map((feature, index) => {
                      return (
                        <li key={index} className="flex items-center space-x-3">
                          <svg
                            className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span>{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                    <Button>Get started</Button>
                </div>
              );
            })
            .slice(-3)}
        </div>
      </div>
    </section>
  );
}

export default PricingPlan;
