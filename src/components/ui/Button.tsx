import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        {
          // Variants
          "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700":
            variant === "primary",
          "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400":
            variant === "secondary",
          "bg-red-500 text-white hover:bg-red-600 active:bg-red-700":
            variant === "danger",
          "bg-transparent text-gray-700 hover:bg-gray-100": variant === "ghost",
          // Sizes
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
