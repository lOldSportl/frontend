import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  type?: "button" | "submit";
  fullWidth?: boolean;
  disabled?: boolean
}

export default function Button({ children, onClick, variant = "primary", className = "", type = "button", fullWidth = false }: ButtonProps) {
  const base = `px-4 py-2 rounded-lg font-semibold transition duration-300 ${fullWidth ? 'w-full' : ''}`;
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-600",
    secondary: "bg-secondary text-white hover:bg-gray-600",
    danger: "bg-danger text-white hover:bg-red-700",
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
