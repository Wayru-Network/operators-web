import { premium_feature } from "./../../node_modules/.pnpm/@prisma+client@6.11.0_prisma@6.11.0_typescript@5.8.3__typescript@5.8.3/node_modules/.prisma/client/index.d";
import { Prisma } from "@/lib/infra/prisma";
import { subscription_plan } from "../generated/prisma";

export interface PricingResponse {
  plans: subscription_plan[];
  premium_features: premium_feature[];
  error?: boolean;
}

export async function getPricings(): Promise<PricingResponse> {
  try {
    const plans = await Prisma.subscription_plan.findMany();
    const premium_features = await Prisma.premium_feature.findMany({
      where: {
        is_active: true,
      },
    });

    const result: PricingResponse = {
      plans,
      premium_features,
    };
    return result;
  } catch (error) {
    console.error("Error fetching pricings:", error);
    return { plans: [], premium_features: [], error: true };
  }
}
