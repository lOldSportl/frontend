import { Need } from "../types";

interface Props {
  need: Need;
  onClick: () => void;
  view: "list" | "grid";
}

export default function NeedCard({ need, onClick, view }: Props) {
  const isGrid = view === "grid";

  return (
    <div
      onClick={onClick}
      className={`transition cursor-pointer ${
        isGrid
          ? "card h-[240px] flex flex-col justify-between"
          : "w-full border-b border-gray-300 py-4 px-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <div className={`${isGrid ? "font-bold text-lg mb-2" : "font-semibold text-base"}`}>
        {need.title}
      </div>
      <div className="text-sm mb-1"><strong>Важность:</strong> {need.importance}</div>
      <div className="text-sm mb-1"><strong>Приоритет:</strong> {need.priority}</div>
      <div className="text-sm"><strong>Статус:</strong> {need.status}</div>
    </div>
  );
}