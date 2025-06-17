import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Need } from "../types";
import { addNeed, deleteNeed, updateNeed } from "../api/needs";
import { useData } from "../context/DataProvider";
import Input from "../components/ui/Input";
import TextArea from "../components/ui/TextArea";
import DatePicker from "../components/ui/DatePicker";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";

const priorityOptions = ["низкий", "средний", "высокий"];
const statusOptions = ["новая", "в работе", "выполена"];

export default function NeedDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id || id === "new";
  const { needs, projects, refreshAll } = useData();

  const existingNeed = needs.find((n) => n.id === Number(id));
  const [isEditing, setIsEditing] = useState(isNew);

  const [formData, setFormData] = useState<Omit<Need, "id" | "createdAt" | "updatedAt" | "versionHistory">>(
    existingNeed
      ? { ...existingNeed }
      : {
          title: "",
          description: "",
          importance: "средняя",
          attributes: [],
          responsible: "",
          status: "новая",
          projectId: 0,
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date().toISOString().split("T")[0],
          priority: "средний",
          creator: "admin",
          attachedDocuments: [],
        }
  );

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: name === "projectId" ? Number(value) : value }));
  };

  const isFormValid = (): boolean => {
    return (
      formData.title.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.responsible.trim() !== "" &&
      formData.projectId !== 0
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      alert("Пожалуйста, заполните все обязательные поля.");
      return;
    }

    if (isNew) {
      addNeed(formData).then(() => {
        refreshAll();
        navigate("/needs");
      });
    } else {
      updateNeed({
        ...formData,
        id: Number(id),
        createdAt: "",
        updatedAt: "",
        versionHistory: [],
      }).then(() => {
        refreshAll();
        setIsEditing(false);
      });
    }
  };

  const handleDelete = () => {
    if (!id || isNew) return;
    if (window.confirm("Удалить потребность?")) {
      deleteNeed(Number(id)).then(() => {
        refreshAll();
        navigate("/needs");
      });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isNew
          ? "Создание потребности"
          : isEditing
          ? "Редактирование потребности"
          : "Просмотр потребности"}
      </h2>

      <Button variant="secondary" onClick={() => navigate("/needs")} className="mb-4">
        Назад
      </Button>

      {isEditing ? (
        <>
          <Input
            label="Название*"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <TextArea
            label="Описание*"
            value={formData.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <div className="flex gap-4 mb-4">
            <DatePicker
              label="Начало"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
            <DatePicker
              label="Конец"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </div>

          <Input
            label="Ответственный*"
            value={formData.responsible}
            onChange={(e) => handleChange("responsible", e.target.value)}
          />

          <Select
            label="Проект*"
            value={formData.projectId ? formData.projectId.toString() : "0"}
            onChange={(value) => handleChange("projectId", value)}
            options={[{ value: "0", label: "Выберите проект" }, ...projects.map((p) => ({ value: p.id.toString(), label: p.title }))]}
          />

          <Select
            label="Приоритет"
            value={formData.priority}
            onChange={(value) => handleChange("priority", value)}
            options={priorityOptions.map((p) => ({ value: p, label: p }))}
          />
          <Select
            label="Статус"
            value={formData.status}
            onChange={(value) => handleChange("status", value)}
            options={statusOptions.map((s) => ({ value: s, label: s }))}
          />

          <div className="flex space-x-4 mt-4">
            <Button variant="primary" onClick={handleSubmit} disabled={!isFormValid()}>
              Сохранить
            </Button>
            {!isNew && <Button variant="danger" onClick={handleDelete}>Удалить</Button>}
          </div>
        </>
      ) : (
        <>
          <div>
            <strong>Название:</strong> {existingNeed?.title}
          </div>
          <div>
            <strong>Описание:</strong> {existingNeed?.description}
          </div>
          <div>
            <strong>Даты:</strong> {existingNeed?.startDate} — {existingNeed?.endDate}
          </div>
          <div>
            <strong>Ответственный:</strong> {existingNeed?.responsible}
          </div>
          <div>
            <strong>Приоритет:</strong> {existingNeed?.priority}
          </div>
          <div>
            <strong>Статус:</strong> {existingNeed?.status}
          </div>

          <div className="flex space-x-4 mt-4">
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              Редактировать
            </Button>
            <Button variant="danger" onClick={handleDelete}>Удалить</Button>
          </div>
        </>
      )}
    </div>
  );
}