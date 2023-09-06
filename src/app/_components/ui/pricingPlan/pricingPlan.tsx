import ProductVariants from "./productVariants";
import { env } from "@/env.mjs";
import { serverClient } from "@/app/_trpc/serverClient";
import { db } from "@/db";
import { products } from "@/db/schema/products";

async function PricingPlan() {

  const [product] = await db.select().from(products)

  console.log(product)

  const { data: productVariants } = await (
    await serverClient()
  ).paymentSubscription.getProductVariants({ productId: product.id });

  if (!productVariants) {
    throw new Error("No product variants");
  }

  

  return (
    <section className="bg-primary-foreground">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            {product.name}
          </h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            {product.description.replace(/<\/?p>/g, "")}
          </p>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          <ProductVariants productVariants={productVariants} />
        </div>
      </div>
    </section>
  );
}

export default PricingPlan;
