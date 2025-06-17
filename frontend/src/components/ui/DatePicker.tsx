import React from "react";

interface DatePickerProps {
  value: string; // строго string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

export default function DatePicker({ value, onChange, label }: DatePickerProps) {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="font-medium mb-1">{label}</label>}
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="border border-border rounded-lg px-3 py-2 bg-white text-black focus:ring-2 ring-primary"
      />
    </div>
  );
}
