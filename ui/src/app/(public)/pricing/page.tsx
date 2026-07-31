import Pricing from "@/components/pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Pricing - Creator Stack',
    description: 'Compare our pricing plans and choose the perfect one for your business.',
    openGraph: {
        title: 'Pricing - Creator Stack',
        description: 'Compare our pricing plans and choose the perfect one for your business.',
    },
};

export default function PricingPage() {
    return (
        <Pricing />
    )
}