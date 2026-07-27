import { useTheme } from "@/providers/mode-theme";

export const Title = ({ title, description, className = "", titleStyle, descriptionStyle }: { title: string, description?: string, className?: string, titleStyle?: string, descriptionStyle?: string }) => {
    const { theme } = useTheme();
    const isLight = theme === "light";

    const defaultTitleStyle = isLight ? "text-slate-900 font-serif font-bold" : "text-white/90 font-serif font-bold";
    const defaultDescStyle = isLight ? "text-slate-600 font-medium" : "text-gray-400 font-medium";

    return (
        <div className={`text-center ${className}`}>
            <h2 className={`text-3xl md:text-4xl lg:text-5xl tracking-tight ${titleStyle || defaultTitleStyle}`}>
                {title}
            </h2>
            {description && (
                <p className={`text-sm md:text-base mt-4 max-w-xl mx-auto leading-relaxed ${descriptionStyle || defaultDescStyle}`}>
                    {description}
                </p>
            )}
        </div>
    );
}
