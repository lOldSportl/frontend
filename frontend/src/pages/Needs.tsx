import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataProvider";
import Pagination from "../components/Pagination";
import ViewToggle from "../components/ViewToggle";
import NeedCard from "../components/NeedCard";
import Button from "../components/ui/Button";

const ITEMS_PER_PAGE = 6;

export default function Needs() {
  const { needs, isLoading } = useData();
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const navigate = useNavigate();

  const totalPages = Math.ceil(needs.length / ITEMS_PER_PAGE);
  const visibleItems = needs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleCreate = () => {
    navigate(`/needs/new`);
  };

   if (!isLoading && needs.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        <h1 className="text-2xl font-bold mb-4">Потребности</h1>
        <p>Нет потребностей. Нажмите "Создать новую потребность", чтобы начать.</p>
        <Button variant="primary" className="mt-4" onClick={handleCreate}>
          Создать новую потребность
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Потребности</h1>
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      <Button variant="primary" className="mb-4" onClick={handleCreate}>
        Создать новую потребность
      </Button>

      {viewMode === "list" ? (
        <ul className="space-y-4 list-none p-0">
          {visibleItems.map((need) => (
            <li key={need.id}>
              <NeedCard
  key={need.id}
  need={need}
  view={viewMode}
  onClick={() => navigate(`/needs/${need.id}`)}
/>

            </li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleItems.map((need) => (
            <NeedCard
  key={need.id}
  need={need}
  view={viewMode}
  onClick={() => navigate(`/needs/${need.id}`)}
/>

          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
