"use client";

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/providers/mode-theme';

export interface BlogCardProps {
    imageSrc: string;
    imageAlt: string;
    category: string;
    categoryVariant?: 'violet' | 'teal' | 'indigo' | 'pink';
    title: string;
    description: string;
    readTime: string;
    imageEffectClass?: string;
}

export default function BlogCard({
    imageSrc,
    imageAlt,
    category,
    categoryVariant = 'violet',
    title,
    description,
    readTime,
    imageEffectClass = ''
}: BlogCardProps) {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    const tagColorClass = `blog-card-tag-${categoryVariant}`;

    return (
        <div className={`blog-card group ${themeClass}`}>
            <div className={`blog-card-img-wrap relative ${themeClass}`}>
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-cover opacity-80 group-hover:scale-110 transition-transform duration-700 ${imageEffectClass}`}
                />
            </div>
            <div className="p-6 lg:p-8 flex flex-col flex-1">
                <div>
                    <span className={`blog-card-tag ${tagColorClass} ${themeClass}`}>
                        {category}
                    </span>
                </div>
                <h3 className={`blog-card-title ${themeClass}`}>
                    {title}
                </h3>
                <p className={`blog-card-desc ${themeClass}`}>
                    {description}
                </p>
                <div className={`blog-card-footer ${themeClass}`}>
                    <span className={`blog-card-readtime ${themeClass}`}>
                        {readTime}
                    </span>
                    <button className={`blog-card-action group/btn ${themeClass}`}>
                        ARTICLE <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
