import React from "react";

export type TagOption = {
  label: string;
  value: string;
};

export interface TagSelectorProps {
  value: TagOption[];
  onChange: (tags: TagOption[]) => void;
  availableTags: TagOption[];
}

const TagSelector: React.FC<TagSelectorProps> = ({ value, onChange, availableTags }) => {
  const toggleTag = (tag: TagOption) => {
    const exists = value.some((t) => t.value === tag.value);
    if (exists) {
      onChange(value.filter((t) => t.value !== tag.value));
    } else {
      onChange([...value, tag]);
    }
  };

  const tagColors: Record<string, string> = {
    ui: "bg-blue-500",
    backend: "bg-green-500",
    api: "bg-purple-500",
    bug: "bg-red-500",
    feature: "bg-yellow-500",
  };

  return (
    <div className="flex flex-wrap gap-2">
      {availableTags.map((tag) => (
        <button
          key={tag.value}
          type="button"
          className={`px-3 py-1 rounded-full text-white text-sm 
            ${tagColors[tag.value] || "bg-gray-500"} 
            ${value.some((t) => t.value === tag.value) ? "opacity-100" : "opacity-50"}`}
          onClick={() => toggleTag(tag)}
        >
          {tag.label}
        </button>
      ))}
    </div>
  );
};

export default TagSelector;
