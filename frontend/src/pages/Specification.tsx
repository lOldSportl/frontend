import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../context/DataProvider";
import Button from "../components/ui/Button";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface RequirementNode {
  id: string;
  title: string;
  description: string;
  needId?: number;
}

const Specification: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { requirements, needs } = useData();
  const [selected, setSelected] = useState<RequirementNode | null>(null);

  const functionalReqs = useMemo(
    () =>
      requirements
        .filter((r) => r.projectId === Number(projectId) && r.type === "Функциональное")
        .map((r, index) => ({
          id: `1.${index + 1}`,
          title: r.title,
          description: r.description,
          needId: r.needId,
        })),
    [requirements, projectId]
  );

  const nonFunctionalReqs = useMemo(
    () =>
      requirements
        .filter((r) => r.projectId === Number(projectId) && r.type === "Нефункциональное")
        .map((r, index) => ({
          id: `2.${index + 1}`,
          title: r.title,
          description: r.description,
          needId: r.needId,
        })),
    [requirements, projectId]
  );

  const allData = [
    { id: "1", title: "Функциональные требования", children: functionalReqs },
    { id: "2", title: "Нефункциональные требования", children: nonFunctionalReqs },
  ];

  const renderTree = (data: typeof allData) => (
    <ul className="ml-4">
      {data.map((group) => (
        <li key={group.id}>
          {`${group.id}. ${group.title}`}
          <ul className="ml-4">
            {group.children.map((child) => (
              <li key={child.id}>
                <button onClick={() => setSelected(child)} className="text-left hover:underline">
                  {child.id}. {child.title}
                </button>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );

  const downloadXLSX = () => {
    const dataRows = [
      ["ID", "Тип", "Название требования", "Описание требования", "Потребность", "Описание потребности"],
      ...[...functionalReqs, ...nonFunctionalReqs].map((r) => {
        const need = needs.find((n) => n.id === r.needId);
        return [
          r.id,
          r.id.startsWith("1.") ? "Функциональное" : "Нефункциональное",
          r.title,
          r.description,
          need?.title || "-",
          need?.description || "-",
        ];
      }),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Спецификация требований");

    // Auto width
    const columnWidths = dataRows[0].map((_, colIndex) => ({
      wch: Math.max(
        ...dataRows.map((row) => (row[colIndex] ? row[colIndex].toString().length : 10)),
        10
      ),
    }));
    worksheet["!cols"] = columnWidths;

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "specification.xlsx");
  };

  const selectedNeed = useMemo(() => {
    const req = [...functionalReqs, ...nonFunctionalReqs].find((r) => r.id === selected?.id);
    if (!req || !req.needId) return null;
    return needs.find((n) => n.id === req.needId);
  }, [selected, needs, functionalReqs, nonFunctionalReqs]);

  return (
    <div className="flex flex-col h-full p-6 gap-6">
      <div className="flex h-full gap-6">
        <div className="w-1/3 overflow-y-auto border-r pr-4">
          <h2 className="text-xl font-bold mb-4">Структура требований</h2>
          <div className="mb-4">
            <Button variant="secondary" onClick={() => navigate(`/projects/${projectId}`)}>
              Назад к проекту
            </Button>
          </div>
          {renderTree(allData)}
        </div>

        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Описание требования</h2>

          {selected ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {selected.id}. {selected.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{selected.description}</p>

              {selectedNeed && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-1">Связанная потребность:</h4>
                  <p className="text-blue-900 font-medium">{selectedNeed.title}</p>
                  <p className="text-gray-700 dark:text-gray-300">{selectedNeed.description}</p>
                </div>
              )}
            </div>
          ) : (
            <p>Выберите требование слева.</p>
          )}

          <div className="mt-8">
            <Button onClick={downloadXLSX}>Скачать .xlsx</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specification;