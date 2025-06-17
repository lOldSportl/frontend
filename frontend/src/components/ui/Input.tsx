import React from "react";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
}

export default function Input({ value, onChange, label, placeholder, type = "text", className = "" }: InputProps) {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="font-medium mb-1">{label}</label>}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className={`border border-border rounded-lg px-3 py-2 bg-white text-black focus:ring-2 ring-primary ${className}`}
      />
    </div>
  );
}
