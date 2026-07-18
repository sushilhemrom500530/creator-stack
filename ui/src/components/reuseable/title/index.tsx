export const Title = ({ title, description, className }: { title: string, description: string, className?: string }) => {
    return (
        <div className={`text-center ${className}`}>
            <h2 className="text-xl md:text-3xl lg:text-5xl xl:text-6xl font-semibold">
                {title}
            </h2>
            <p className="text-gray-300 text-sm font-medium mt-4">
                {description}
            </p>
        </div>
    );
}