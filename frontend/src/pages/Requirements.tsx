import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataProvider";
import Pagination from "../components/Pagination";
import ViewToggle from "../components/ViewToggle";
import RequirementCard from "../components/RequirementCard";
import Button from "../components/ui/Button";

const ITEMS_PER_PAGE = 6;

export default function Requirements() {
  const { requirements, projects, needs, isLoading } = useData();
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const navigate = useNavigate();

  const totalPages = Math.ceil(requirements.length / ITEMS_PER_PAGE);
  const visibleItems = requirements.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleCreate = () => {
    navigate(`/requirements/new`);
  };

  if (!isLoading && requirements.length === 0) {
  return (
    <div className="p-6 text-gray-500">
      <h1 className="text-2xl font-bold mb-4">Требования</h1>
      <p>Нет требований. Нажмите "Создать новое требование", чтобы начать.</p>
      <Button variant="primary" className="mt-4" onClick={handleCreate}>
        Создать новое требование
      </Button>
    </div>
  );
}

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Требования</h1>
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      <Button variant="primary" className="mb-4" onClick={handleCreate}>
        Создать новое требование
      </Button>

      {viewMode === "list" ? (
        <ul className="space-y-4 list-none p-0">
          {visibleItems.map((req) => (
            <li key={req.id}>
              <RequirementCard
  requirement={req}
  project={projects.find(p => p.id === req.projectId)}
  need={needs.find(n => n.id === req.needId)}
  view={viewMode}
  onClick={() => navigate(`/requirements/${req.id}`)}
/>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleItems.map((req) => (
            <RequirementCard
  requirement={req}
  project={projects.find(p => p.id === req.projectId)}
  need={needs.find(n => n.id === req.needId)}
  view={viewMode}
  onClick={() => navigate(`/requirements/${req.id}`)}
/>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
