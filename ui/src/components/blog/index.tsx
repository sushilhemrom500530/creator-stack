"use client";

import { useState } from 'react';
import { useTheme } from '@/providers/mode-theme';
import BlogFeatures from '@/components/blog/features';
import BlogCard, { BlogCardProps } from '@/components/blog-card';
import "./index.css";

interface BlogPostItem extends BlogCardProps {
    filterCategory: string;
}

const blogPosts: BlogPostItem[] = [
    {
        imageSrc: "https://images.unsplash.com/photo-1620825937374-87fc7d62828e?q=80&w=800&auto=format&fit=crop",
        imageAlt: "Abstract Glass",
        category: "ALGORITHMIC TRENDS",
        categoryVariant: "violet",
        title: "Mastering the Attention Economy in 2024",
        description: "How SocialFlow AI leverages predictive analytics to capture high-intent engagement windows before they trend.",
        readTime: "5 min read",
        filterCategory: "STRATEGY"
    },
    {
        imageSrc: "https://images.unsplash.com/photo-1682687982501-1e5898cb89c4?q=80&w=800&auto=format&fit=crop",
        imageAlt: "Nature Chip",
        category: "PRODUCT UPDATES",
        categoryVariant: "teal",
        title: "Introducing Aetheris-2: The New Logic Engine",
        description: "A deep dive into our latest model upgrade that reduces hallucination by 84% in social contexts.",
        readTime: "8 min read",
        filterCategory: "TECH STACK"
    },
    {
        imageSrc: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop",
        imageAlt: "Stairs",
        category: "ENTERPRISE SCALE",
        categoryVariant: "indigo",
        title: "Governing AI Across Global Teams",
        description: "Best practices for maintaining brand consistency while deploying autonomous agents across continents.",
        readTime: "12 min read",
        imageEffectClass: "grayscale group-hover:grayscale-0",
        filterCategory: "STRATEGY"
    },
    {
        imageSrc: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
        imageAlt: "AI Human Frame",
        category: "ETHICS & FUTURE",
        categoryVariant: "pink",
        title: "The Trust Protocol: AI Transparency",
        description: "How we are building a more transparent social ecosystem through verifiable AI signatures.",
        readTime: "6 min read",
        imageEffectClass: "mix-blend-screen",
        filterCategory: "TECH STACK"
    }
];

export default function Blogs() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    const [activeFilter, setActiveFilter] = useState<string>("ALL POSTS");

    const filters = ["ALL POSTS", "STRATEGY", "TECH STACK"];

    const filteredPosts = blogPosts.filter((post) => {
        if (activeFilter === "ALL POSTS") return true;
        return post.filterCategory === activeFilter;
    });

    return (
        <div className={`blog-page-container ${themeClass}`}>
            <div className="max-w-[1200px] w-full mx-auto flex flex-col items-center relative z-10">

                {/* Header Subtext & Title */}
                <div className="text-center mb-20 max-w-2xl relative w-full flex flex-col items-center justify-center">
                    {/* Ambient Background Glow matching Resources banner glow */}
                    <div className={`blog-banner-glow ${themeClass}`}></div>

                    <div className={`tagline-badge ${themeClass}`}>
                        <span className="tagline-dot" />
                        <span className={`tagline-text ${themeClass}`}>
                            Perspective
                        </span>
                    </div>
                    <h1 className={`blog-header-title ${themeClass}`}>
                        Intelligence Weekly
                    </h1>
                    <p className={`blog-header-desc ${themeClass}`}>
                        Exploring the frontier of generative AI, automated engagement, and the future of digital presence for the world's most innovative brands.
                    </p>
                </div>

                {/* Featured Post Card */}
                <BlogFeatures />

                {/* Recent Insights header & Filter Buttons */}
                <div className="w-full flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
                    <h2 className={`blog-recent-heading ${themeClass}`}>Recent Insights</h2>
                    <div className="flex gap-2">
                        {filters.map((filter) => {
                            const isActive = activeFilter === filter;
                            return (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`cursor-pointer ${isActive ? "blog-filter-btn-active" : "blog-filter-btn"} ${themeClass}`}
                                >
                                    {filter}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3-Column Grid Layout using reusable BlogCard component */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {filteredPosts.map((post, index) => (
                        <BlogCard key={index} {...post} />
                    ))}
                </div>
            </div>
        </div>
    );
}