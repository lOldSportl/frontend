import { Project } from "../types";

interface Props {
  project: Project;
  view: "list" | "grid";
  onClick: () => void;
}

export default function ProjectCard({ project, view, onClick }: Props) {
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
        {project.title || "Без названия"}
      </div>
      <div className="text-sm mb-1">
        <strong>Срок:</strong> {project.deadline || "—"}
      </div>
      <div className="text-sm">
        <strong>Статус:</strong> {project.status || "—"}
      </div>
    </div>
  );
}
