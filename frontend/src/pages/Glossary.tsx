import { useEffect, useState } from "react";
import { useData } from "../context/DataProvider";
import Input from "../components/ui/Input";
import TextArea from "../components/ui/TextArea";
import Button from "../components/ui/Button";
import {
  getGlossary,
  addGlossaryItem,
  updateGlossaryItem,
  deleteGlossaryItem,
} from "../api/glossary";
import { GlossaryItem, GlossaryItemCreate } from "../types.tsx";
import { useParams, useNavigate } from "react-router-dom";

export default function Glossary() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  useData();
  const [terms, setTerms] = useState<GlossaryItem[]>([]);
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTerms();
  }, [projectId]);

  const loadTerms = async () => {
    const data = await getGlossary();
    const filteredByProject = data.filter(
      (item) => String(item.project) === String(projectId)
    );
    setTerms(filteredByProject);
  };

  const handleAdd = async () => {
    if (!term.trim() || !definition.trim()) {
      setError("Пожалуйста, заполните оба поля.");
      return;
    }

    setError("");

    if (editId !== null) {
      const updated: GlossaryItem = {
        id: editId,
        term,
        definition,
        project: projectId ?? "",
      };
      await updateGlossaryItem(updated);
    } else {
      const newItem: GlossaryItemCreate = {
        term,
        definition,
        project: projectId ?? "",
      };
      await addGlossaryItem(newItem);
    }

    await loadTerms();
    resetForm();
  };

  const handleDelete = async (id: number) => {
    await deleteGlossaryItem(id);
    await loadTerms();
    resetForm();
  };

  const handleEdit = (item: GlossaryItem) => {
    setEditId(item.id);
    setTerm(item.term);
    setDefinition(item.definition);
  };

  const resetForm = () => {
    setEditId(null);
    setTerm("");
    setDefinition("");
    setError("");
  };

  const filtered = search
    ? terms.filter(
        (t) =>
          t.term.toLowerCase().includes(search.toLowerCase()) ||
          t.definition.toLowerCase().includes(search.toLowerCase())
      )
    : terms;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Глоссарий проекта</h1>

      <div className="mb-4">
        <Button variant="secondary" onClick={() => navigate(`/projects/${projectId}`)}>
          Назад к проекту
        </Button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск..."
        />
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Термин*"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />

        <TextArea
          label="Определение*"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          rows={1}
        />

        <div className="flex items-end gap-2">
          <Button variant="primary" onClick={handleAdd}>
            {editId !== null ? "Сохранить" : "Добавить"}
          </Button>

          {editId !== null && (
            <Button variant="secondary" onClick={resetForm}>
              Отмена
            </Button>
          )}
        </div>
      </div>

      {error && <div className="text-red-600 mb-4 font-medium">{error}</div>}

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-2 px-3 text-left">Термин</th>
              <th className="py-2 px-3 text-left">Определение</th>
              <th className="py-2 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  Нет терминов
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="py-2 px-3 font-semibold">{t.term}</td>
                  <td className="py-2 px-3">{t.definition}</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button
                      className="text-blue-600 hover:underline font-bold"
                      onClick={() => handleEdit(t)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="text-red-600 hover:underline font-bold"
                      onClick={() => handleDelete(t.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}