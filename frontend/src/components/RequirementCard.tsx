import { Requirement, Project, Need } from "../types";

interface Props {
  requirement: Requirement;
  project?: Project;
  need?: Need;
  onClick: () => void;
  view: "list" | "grid";
}

export default function RequirementCard({ requirement, project, need, onClick, view }: Props) {
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
        {requirement.title}
      </div>
      <div className="text-sm mb-1"><strong>Проект:</strong> {project?.title || "—"}</div>
      <div className="text-sm mb-1"><strong>Потребность:</strong> {need?.title || "—"}</div>
      <div className="text-sm"><strong>Статус:</strong> {requirement.status}</div>
    </div>
  );
}
