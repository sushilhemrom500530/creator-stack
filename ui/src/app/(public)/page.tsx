import BannerSection from "@/components/home/banner";
import PerformanceTeamsSection from "@/components/home/performance-teams";
import { DominateSection } from "@/components/home/dominate";

export default function HomePage() {
    return (
        <div>
            <BannerSection />
            <PerformanceTeamsSection />
            <DominateSection />
        </div>
    );
}