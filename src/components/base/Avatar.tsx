import React from "react";
import Image from "next/image";

export interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: "sm" | "md" | "lg";
}

/**
 * Avatar component with fallback to initials
 */
export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    name,
    size = "md",
}) => {
    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
    };

    const getInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div
            className={`${sizes[size]} rounded-full overflow-hidden bg-primary-100 flex items-center justify-center`}
        >
            {src ? (
                <Image
                    src={src}
                    alt={alt || name || "Avatar"}
                    width={size === "sm" ? 32 : size === "md" ? 40 : 48}
                    height={size === "sm" ? 32 : size === "md" ? 40 : 48}
                    className="object-cover"
                />
            ) : (
                <span className="font-medium text-primary-700">
                    {name ? getInitials(name) : "?"}
                </span>
            )}
        </div>
    );
};
