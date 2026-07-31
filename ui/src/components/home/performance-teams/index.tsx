"use client";

import { useTheme } from "@/providers/mode-theme";
import "./index.css";

export default function PerformanceTeamsSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    const companies = [
        "Airbnb",
        "HubSpot",
        "Google",
        "Microsoft",
        "Walmart",
        "FedEx"
    ];

    const duplicatedCompanies = [...companies, ...companies, ...companies, ...companies];

    return (
        <section className={`perf-teams-section ${themeClass}`}>
            <div className="max-w-[1200px] w-full mx-auto flex flex-col items-center">
                <p className={`perf-teams-heading ${themeClass}`}>
                    Empowering high-performance teams at
                </p>

                <div className="perf-teams-mask-container">
                    <div className="animate-marquee perf-teams-marquee-track">
                        {duplicatedCompanies.map((company, index) => (
                            <div
                                key={index}
                                className={`perf-teams-item ${themeClass}`}
                            >
                                {company}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
