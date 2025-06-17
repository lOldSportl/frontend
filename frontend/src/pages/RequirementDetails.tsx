import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Requirement } from "../types";
import { addRequirement, deleteRequirement, updateRequirement } from "../api/requirements";
import { useData } from "../context/DataProvider";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import Input from "../components/ui/Input";
import TextArea from "../components/ui/TextArea";
import DatePicker from "../components/ui/DatePicker";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";

const statusOptions = ["новая", "в работе", "завершена"];
const priorityOptions = ["низкий", "средний", "высокий"];

export default function RequirementDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id || id === "new";
  const { requirements, projects, needs, refreshAll } = useData();

  const existingRequirement = requirements.find((r) => r.id === Number(id));
  const [isEditing, setIsEditing] = useState(isNew);

  const stakeholderTypeTextMap: Record<string, string> = {
  internal: "внутренний",
  external: "внешний",
};

  const [formData, setFormData] = useState<Omit<Requirement, "id">>(
    existingRequirement
      ? { ...existingRequirement }
      : {
          title: "",
          shortDescription: "",
          description: "",
          descriptionTemplate: "",
          responsible: [],
          projectStage: "",
          deadlines: new Date().toISOString().split("T")[0],
          status: "новая",
          priority: "средний",
          attributes: [],
          relatedRequirements: [],
          notes: "",
          tags: [],
          projectId: projects[0]?.id || 0,
          needId: needs[0]?.id || 0,
          creator: "admin",
          createdAt: "",
          updatedAt: "",
          versionHistory: [],
          type: "Функциональное",
          stakeholderType: "internal",
        }
  );

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "projectId" || name === "needId" ? Number(value) : value,
    }));
  };

  const isFormValid = (): boolean => {
    return (
      formData.title.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.responsible.length > 0 &&
      formData.projectId !== 0 &&
      formData.needId !== 0
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      alert("Пожалуйста, заполните все обязательные поля.");
      return;
    }

    if (isNew) {
      addRequirement(formData).then(() => {
        refreshAll();
        navigate("/requirements");
      });
    } else {
      updateRequirement({ ...formData, id: Number(id) }).then(() => {
        refreshAll();
        setIsEditing(false);
      });
    }
  };

  const handleDelete = () => {
    if (!id || isNew) return;
    if (window.confirm("Удалить требование?")) {
      deleteRequirement(Number(id)).then(() => {
        refreshAll();
        navigate("/requirements");
      });
    }
  };

  const currentProject = projects.find((p) => p.id === formData.projectId);

  const responsibleOptions = currentProject
    ? currentProject.participants.map((p) => ({ value: p.name, label: p.name }))
    : [];

  const attributeOptions = currentProject
    ? currentProject.attributes.map((attr) => ({ value: attr, label: attr }))
    : [];

  const stakeholderOptions = currentProject
    ? currentProject.stakeholders?.map((s) => ({ value: s.name, label: s.name })) ?? []
    : [];

  const availableRequirements = requirements.filter(
    (r) => r.projectId === formData.projectId && (!isNew ? r.id !== Number(id) : true)
  );

  const relatedRequirementOptions = availableRequirements.map((r) => ({
    value: r.id.toString(),
    label: r.title,
  }));

  const projectRequirements = requirements.filter(
    (r) => r.projectId === existingRequirement?.projectId
  );

  const nodes: Node[] = [
    ...projectRequirements.map((req, index) => ({
      id: `req-${req.id}`,
      data: { label: `${req.title}\n${req.type === "Функциональное" ? "Ф" : "НФ"}` },
      position: { x: (index % 5) * 250, y: Math.floor(index / 5) * 200 },
      style: {
        background: req.type === "Функциональное" ? "#e0f7fa" : "#ffe0b2",
        border: "2px solid #333",
        borderRadius: "10px",
        padding: "10px",
        fontWeight: "bold",
      },
    })),
    ...needs.map((need, i) => ({
      id: `need-${need.id}`,
      data: { label: `${need.title}` },
      position: { x: (i % 5) * 300, y: 500 },
      style: {
        background: "#d0e6ff",
        border: "2px dashed #333",
        borderRadius: "10px",
        padding: "10px",
        textAlign: "center",
        fontWeight: "bold",
      },
    })),
  ];

  const edges: Edge[] = [
  // связи между требованиями
  ...projectRequirements.flatMap((req) =>
    req.relatedRequirements.map((relId) => ({
      id: `e${req.id}-${relId}`,
      source: `req-${req.id}`,
      target: `req-${relId}`,
      type: "straight",
      animated: true,
    }))
  ),
  // связи потребность → требование
  ...projectRequirements
    .filter((req) => req.needId)
    .map((req) => ({
      id: `r-n-${req.id}-${req.needId}`,
      source: `req-${req.id}`,
      target: `need-${req.needId}`,
      type: "step",
      animated: true,
    })),
];

  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      if (node.id.startsWith("req-")) {
        navigate(`/requirements/${node.id.replace("req-", "")}`);
      }
    },
    [navigate]
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isNew
          ? "Создание требования"
          : isEditing
          ? "Редактирование требования"
          : "Просмотр Требования"}
      </h2>

      <Button variant="secondary" onClick={() => navigate("/requirements")} className="mb-4">
        Назад
      </Button>

      {isEditing ? (
        <>
          <Input label="Название *" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} />
          <TextArea label="Краткое описание" value={formData.shortDescription ?? ""} onChange={(e) => handleChange("shortDescription", e.target.value)} />
          <TextArea label="Полное описание *" value={formData.description ?? ""} onChange={(e) => handleChange("description", e.target.value)} />

          <Select label="Ответственные *" value={formData.responsible} multiple onChange={(values) => handleChange("responsible", values)} options={responsibleOptions} />
          <Select label="Стейкхолдер" value={formData.stakeholderType} onChange={(value) => handleChange("stakeholderType", value)} options={stakeholderOptions} />
          <Input label="Этап проекта" value={formData.projectStage} onChange={(e) => handleChange("projectStage", e.target.value)} />
          <DatePicker label="Дедлайн" value={formData.deadlines} onChange={(e) => handleChange("deadlines", e.target.value)} />
          <Select label="Статус" value={formData.status} onChange={(value) => handleChange("status", value)} options={statusOptions.map((s) => ({ value: s, label: s }))} />
          <Select label="Приоритет" value={formData.priority} onChange={(value) => handleChange("priority", value)} options={priorityOptions.map((p) => ({ value: p, label: p }))} />
          <Select label="Атрибуты" value={formData.attributes} multiple onChange={(values) => handleChange("attributes", values)} options={attributeOptions} />
          <Select label="Тип" value={formData.type} onChange={(value) => handleChange("type", value)} options={[{ value: "Функциональное", label: "Функциональное" }, { value: "Нефункциональное", label: "Нефункциональное" }]} />
          <Select label="Связанные требования" value={formData.relatedRequirements.map(String)} multiple onChange={(values) => handleChange("relatedRequirements", (values as string[]).map(Number))} options={relatedRequirementOptions} />
          <Select label="Проект *" value={formData.projectId.toString()} onChange={(value) => handleChange("projectId", value)} options={[{ value: "0", label: "Выберите проект" }, ...projects.map((p) => ({ value: p.id.toString(), label: p.title }))]} />
          <Select label="Потребность *" value={formData.needId?.toString() ?? "0"} onChange={(value) => handleChange("needId", value)} options={[{ value: "0", label: "Выберите потребность" }, ...needs.map((n) => ({ value: n.id.toString(), label: n.title }))]} />
          <TextArea label="Примечания" value={formData.notes ?? ""} onChange={(e) => handleChange("notes", e.target.value)} />

          <div className="flex space-x-4 mt-4">
            <Button variant="primary" onClick={handleSubmit} disabled={!isFormValid()}>Сохранить</Button>
            {!isNew && <Button variant="danger" onClick={handleDelete}>Удалить</Button>}
          </div>
        </>
      ) : (
        <>
          <div className="mb-6">
            <div><strong>Название:</strong> {existingRequirement?.title}</div>
            <div><strong>Описание:</strong> {existingRequirement?.description}</div>
            <div><strong>Ответственные:</strong> {existingRequirement?.responsible.join(", ")}</div>
            <div><strong>Стейкхолдер:</strong> {stakeholderTypeTextMap[existingRequirement?.stakeholderType || ""]}</div>
            <div><strong>Атрибуты:</strong> {existingRequirement?.attributes.join(", ")}</div>
            <div><strong>Статус:</strong> {existingRequirement?.status}</div>
            <div><strong>Приоритет:</strong> {existingRequirement?.priority}</div>
            <div><strong>Дедлайн:</strong> {existingRequirement?.deadlines}</div>
          </div>

          <div className="flex space-x-4 mb-4">
            <Button variant="primary" onClick={() => setIsEditing(true)}>Редактировать</Button>
            <Button variant="danger" onClick={handleDelete}>Удалить</Button>
          </div>

          <div style={{ width: "100%", height: "600px" }} className="border rounded-xl my-6 bg-white">
            <ReactFlow nodes={nodes} edges={edges} fitView onNodeClick={onNodeClick}>
              <Controls />
              <Background />
            </ReactFlow>
          </div>
        </>
      )}
    </div>
  );
}
