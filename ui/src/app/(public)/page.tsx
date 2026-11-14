 
import PricingSection from "@/components/home/pricing";
import { ThreeStepSection } from "@/components/home/three-step";
import FAQSection from "@/components/home/faq";
import BannerSection from "@/components/home/banner";
import PerformanceTeamsSection from "@/components/home/performance-teams";
import { DominateSection } from "@/components/home/dominate";


export default function HomePage() {
    return (
        <div>
            <BannerSection />
            <PerformanceTeamsSection />
            <DominateSection />
            <ThreeStepSection />
            <PricingSection />
            <FAQSection />
        </div>
    );
}