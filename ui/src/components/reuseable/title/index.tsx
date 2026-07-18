export const Title = ({ title, description, className, titleStyle = "text-white/80", descriptionStyle = "text-gray-300/80" }: { title: string, description?: string, className?: string, titleStyle?: string, descriptionStyle?: string }) => {
    return (
        <div className={`text-center ${className}`}>
            <h2 className={`text-xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold ${titleStyle}`}>
                {title}
            </h2>
            <p className={`text-gray-300 text-sm md:text-base font-medium mt-4 ${descriptionStyle}`}>
                {description}
            </p>
        </div>
    );
}