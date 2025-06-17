import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataProvider";
import ViewToggle from "../components/ViewToggle";
import Pagination from "../components/Pagination";
import ProjectCard from "../components/ProjectCard";
import Button from "../components/ui/Button";

const ITEMS_PER_PAGE = 6;

export default function Projects() {
  const { projects, isLoading } = useData();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const visibleItems = projects.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleCreate = () => {
    navigate("/projects/new");
  };

  if (!isLoading && projects.length === 0) {
  return (
    <div className="p-6 text-gray-500">
      <h1 className="text-2xl font-bold mb-4">Проекты</h1>
      <p>Нет проектов. Нажмите "Создать новый проект", чтобы начать.</p>
      <Button variant="primary" className="mt-4" onClick={handleCreate}>
        Создать новый проект
      </Button>
    </div>
  );
}

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Проекты</h1>
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      <Button variant="primary" className="mb-4" onClick={handleCreate}>
        Создать новый проект
      </Button>

      {viewMode === "list" ? (
  <ul className="space-y-4 list-none p-0">
    {visibleItems.map((project) => (
      <li key={project.id}>
        <ProjectCard
          project={project}
          view={viewMode}
          onClick={() => navigate(`/projects/${project.id}`)}
        />
      </li>
    ))}
  </ul>
) : (
  <div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    style={{ maxHeight: "calc(2 * 250px + 16px)", overflowY: "auto" }}
  >
    {visibleItems.map((project) => (
      <ProjectCard
        key={project.id}
        project={project}
        view={viewMode}
        onClick={() => navigate(`/projects/${project.id}`)}
      />
    ))}
  </div>
)}

<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

    </div>
  );
}
