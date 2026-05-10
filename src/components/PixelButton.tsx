import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger";
  active?: boolean;
};

export function PixelButton({ children, variant = "primary", active, className = "", ...props }: Props) {
  return (
    <button className={`pixel-button ${variant} ${active ? "active" : ""} ${className}`} {...props}>
      {children}
    </button>
  );
}
