import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: Option[];
  label?: string;
  multiple?: boolean;
}

export default function Select({ value, onChange, options, label, multiple = false }: SelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selected = Array.from(e.target.selectedOptions, (option) => option.value);
      onChange(selected);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className="flex flex-col mb-4">
      {label && <label className="font-medium mb-1">{label}</label>}
      <select
        value={value}
        onChange={handleChange}
        multiple={multiple}
        className="border border-border rounded-lg px-3 py-2 bg-white text-black focus:ring-2 ring-primary"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
