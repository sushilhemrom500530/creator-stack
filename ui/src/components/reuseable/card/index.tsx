"use client";

import React from "react";
import { useTheme } from "@/providers/mode-theme";
import "./index.css";

export interface CardProps {
    title: string;
    description: string;
    image: string;
    imageAlt?: string;
    category?: string;
    variant?: "purple" | "blue" | "cyan" | string;
    buttonText?: string;
    onButtonClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}

export function Card({
    title,
    description,
    image,
    imageAlt = "Card image",
    category,
    variant = "purple",
    buttonText = "Read Guide",
    onButtonClick,
    className = "",
    children,
}: CardProps) {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <div className={`reusable-card group ${themeClass} ${className}`}>
            {image && (
                <div className={`reusable-card-img-container is-${variant} ${themeClass}`}>
                    <img src={image} alt={imageAlt} className={`reusable-card-img ${themeClass}`} />
                </div>
            )}
            {category && (
                <span className={`reusable-card-category ${themeClass}`}>{category}</span>
            )}
            <h3 className={`reusable-card-title ${themeClass}`}>{title}</h3>
            <p className={`reusable-card-text ${themeClass}`}>{description}</p>

            {children}

            {buttonText && (
                <button onClick={onButtonClick} className={`reusable-card-link ${themeClass}`}>
                    {buttonText}
                </button>
            )}
        </div>
    );
}

export default Card;
