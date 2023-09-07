"use client";

import { useRouter } from "next/navigation";

import { Session } from "next-auth";
import { parseHTML } from "linkedom";
import { useSession } from "next-auth/react";

import { AllVariantsType } from "@/schema/lemonSqueezy/variantsSchema";
import { Button } from "../button";
import FeaturesProductVariant from "./featuresProductVariant";

interface ProductVariantsProps {
  productVariants: AllVariantsType;
}

function ProductVariants(props: ProductVariantsProps) {
  const router = useRouter();

  const session = useSession();

  function createCheckoutLink({
    variantId,
    user,
  }: {
    variantId: string;
    user: Session["user"] | null | undefined;
  }) {
    const baseUrl = new URL(
      `https://tarik.lemonsqueezy.com/checkout/buy/${variantId}`
    );

    if (!user) return router.push("/login");

    const email = user.email;
    const name = user.name ? user.name : undefined;
    const userId = user?.id;

    const url = new URL(baseUrl);
    url.searchParams.append("checkout[custom][user_id]", userId);
    if (email) { url.searchParams.append("checkout[email]", email)}
    if (name) {url.searchParams.append("checkout[name]", name)}

    return router.push(url.href);
  }

  return (
    <>
      {props.productVariants
        .map((variant) => {
          const { document } = parseHTML(variant.description);

          const description = document.querySelector("p")?.textContent;

          const features = Array.from(document.querySelectorAll("ul li p")).map(
            (li) => (li as HTMLElement).textContent
          );

          const price = variant.price / 100;

          return (
            <div
              key={`${variant.productId}-${variant.name}`}
              className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white"
            >
              <h3 className="mb-4 text-2xl font-semibold">{variant.name}</h3>
              <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                {description}
              </p>
              <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">${price}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  /{variant.interval}
                </span>
              </div>
              <ul role="list" className="mb-8 space-y-4 text-left">
                <FeaturesProductVariant features={features} />
              </ul>
              <Button
                onClick={() =>
                  createCheckoutLink({
                    user: session.data?.user,
                    variantId: variant.slug,
                  })
                }
              >
                Get started
              </Button>
            </div>
          );
        })
      }
    </>
  );
}

export default ProductVariants;
