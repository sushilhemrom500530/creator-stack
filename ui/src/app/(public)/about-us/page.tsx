import AboutUs from "@/components/about-us";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us - Creator Stack | The Autonomous Social Layer",
    description: "Learn about the mission, values, and engineering behind Creator Stack — the cognitive social media management platform built for modern creators and enterprises.",
    openGraph: {
        title: "About Us - Creator Stack",
        description: "Empowering creators and brands with intelligent social orchestration and predictive audience analytics.",
    },
};

export default function AboutUsPage() {
    return <AboutUs />;
}