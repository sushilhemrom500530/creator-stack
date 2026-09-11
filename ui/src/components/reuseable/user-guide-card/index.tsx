"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/providers/mode-theme";
import "./index.css";

export interface CardProps {
    id?: string | number;
    title: string;
    description: string;
    image: string;
    imageAlt?: string;
    category?: string;
    variant?: "purple" | "blue" | "cyan" | string;
    buttonText?: string;
    href?: string;
    onButtonClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}

export default function UserGuideCard({
    id,
    title,
    description,
    image,
    imageAlt = "Card image",
    category,
    variant = "purple",
    buttonText = "Read Guide",
    href,
    onButtonClick,
    className = "",
    children,
}: CardProps) {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    const targetHref = href || (id ? `/resources/view/${id}` : "/resources/view/1525");

    return (
        <div className={`reusable-card group ${themeClass} ${className}`}>
            {image && (
                <Link href={targetHref} className={`reusable-card-img-container is-${variant} ${themeClass} block`}>
                    <img src={image} alt={imageAlt} className={`reusable-card-img ${themeClass}`} />
                </Link>
            )}
            {category && (
                <span className={`reusable-card-category ${themeClass}`}>{category}</span>
            )}
            <Link href={targetHref} className="block">
                <h3 className={`reusable-card-title ${themeClass} hover:text-violet-600 dark:hover:text-violet-400 transition-colors`}>
                    {title}
                </h3>
            </Link>
            <p className={`reusable-card-text ${themeClass}`}>{description}</p>

            {children}

            {buttonText && (
                onButtonClick ? (
                    <button onClick={onButtonClick} className={`reusable-card-link ${themeClass}`}>
                        {buttonText}
                    </button>
                ) : (
                    <Link href={targetHref} className={`reusable-card-link ${themeClass}`}>
                        {buttonText}
                    </Link>
                )
            )}
        </div>
    );
}

