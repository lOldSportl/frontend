import { Grid, List } from "lucide-react";

type ViewMode = "list" | "grid";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange("list")}
        className={`p-2 rounded-lg border transition duration-200 ${
          value === "list"
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
        }`}
        title="Список"
      >
        <List className="w-5 h-5" />
      </button>
      <button
        onClick={() => onChange("grid")}
        className={`p-2 rounded-lg border transition duration-200 ${
          value === "grid"
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
        }`}
        title="Карточки"
      >
        <Grid className="w-5 h-5" />
      </button>
    </div>
  );
}
