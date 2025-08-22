import { StripeProduct } from "@/lib/interfaces/stripe";
import { Hotspot } from "../../../hotspots/_services/get-hotspots";


export interface BillingProviderProps {
    children: React.ReactNode;
    products: StripeProduct[];
    hotspots: Hotspot[];
}

/** */
export type BillingContextType = {
    /**
    * Products available of stripe
    */
    products: StripeProduct[];
    /**
    * Number total of hotspots selected for the customer
    */
    hotspotsToAdd: number;
    /**
    * Update the total of hotpots selected for the customer
    */
    handleHotspotsToAdd: (hotspots: number) => void;
    /**
     * Array of available hotspots obtained by the client's wallet
     */
    hotspots: Hotspot[];
    /**
     * function to ad more hotspots obtained by the client's wallet
     */
    addHotspot: (h: Hotspot[]) => void;
    /**
     * Customer context, if you need to know what the customer wants to do in the checkout component
     * update, cancel plan, etc.
     */
    customerContext: CustomerContext;
    /**
    * Function to get prorated price
    */
    getProratedPrice: (props: GetProratedPrice) => number
    /**
   * amount of new hotspot to add a current subscription
   */
    newHotspotsToAddAmount: number
};

export type SubscriptionStatus = "active" | "canceling" | "expired";
export type HotspotChange = "same" | "adding" | "removing";
export type CustomerAction =
    | "reactivating_checkout"
    | "reactivating_not_checkout"
    | "reactivate_adding"
    | "reactivate_removing"
    | "update_adding"
    | "update_removing"
    | "activating";

export interface CustomerContext {
    action: CustomerAction;
    subscriptionStatus: SubscriptionStatus;
    hotspotChange: HotspotChange;
    requiresPaymentMethod: boolean;
}

export interface GetProratedPrice {
    unitPrice: number;
    daysUntilNextBilling: number;
}