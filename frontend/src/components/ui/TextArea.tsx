import React from "react";

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  rows?: number;
}

export default function TextArea({ value, onChange, label, rows = 3 }: TextAreaProps) {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="font-medium mb-1">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className="border border-border rounded-lg px-3 py-2 bg-white text-black focus:ring-2 ring-primary resize-none"
      />
    </div>
  );
}
