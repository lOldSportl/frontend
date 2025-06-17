import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Project, Participant } from "../types";
import { addProject, deleteProject, updateProject } from "../api/projects";
import { useData } from "../context/DataProvider";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import TextArea from "../components/ui/TextArea";
import DatePicker from "../components/ui/DatePicker";
import Button from "../components/ui/Button";
import ReactFlow, { Background, Position, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

const statusOptions = [
  { value: "Активен", label: "Активен" },
  { value: "На рассмотрении", label: "На рассмотрении" },
  { value: "Закрыт", label: "Закрыт" },
];

const stakeholderRoles = ["Внутренний", "Внешний"];

export default function ProjectDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id || id === "new";
  const { projects, requirements, needs, refreshAll } = useData();

  const existingProject = projects.find((p) => p.id === Number(id));
  const [isEditing, setIsEditing] = useState(isNew);
  const [formData, setFormData] = useState<Omit<Project, "id"> | null>(null);
  const [showDescription, setShowDescription] = useState(false);

  const [participantName, setParticipantName] = useState("");
  const [participantRole, setParticipantRole] = useState("");
  const [stakeholderName, setStakeholderName] = useState("");
  const [stakeholderRole, setStakeholderRole] = useState(stakeholderRoles[0]);
  const [stakeholderInfluence, setStakeholderInfluence] = useState(0);

  useEffect(() => {
    if (isNew) {
      setFormData({
        title: "",
        shortDescription: "",
        description: "",
        deadline: new Date().toISOString().split("T")[0],
        participants: [],
        attributes: [],
        status: "Активен",
        goal: "",
        stages: [],
        stakeholders: [],
        glossary: [],
        specification: "",
        attachedDocuments: [],
        activityLog: [],
      });
    } else if (existingProject) {
      setFormData({ ...existingProject });
    }
  }, [isNew, existingProject]);

  if (!isNew && !existingProject) {
    return <div>Проект не найден.</div>;
  }

  const handleChange = (name: string, value: any) => {
    if (!formData) return;
    setFormData((prev) => ({ ...prev!, [name]: value }));
  };

    const isFormValid = (): boolean => {
      if (!formData) return false;

      return (
      formData.title.trim() !== "" &&
      formData.shortDescription.trim() !== "" &&
      formData.deadline.trim() !== "" &&
      formData.status.trim() !== ""
    );
  };

  const handleSubmit = () => {
    if (!formData || !isFormValid()) {
      alert("Пожалуйста, заполните все обязательные поля.");
      return;
    }

    if (isNew) {
      addProject(formData).then(() => {
        refreshAll();
        navigate("/projects");
      });
    } else {
      updateProject({ ...formData, id: Number(id) }).then(() => {
        refreshAll();
        setIsEditing(false);
      });
    }
  };

  const handleDelete = () => {
    if (!id || isNew) return;
    if (window.confirm("Вы уверены, что хотите удалить проект?")) {
      deleteProject(Number(id)).then(() => {
        refreshAll();
        navigate("/projects");
      });
    }
  };

  const addParticipant = () => {
    if (!participantName.trim()) return;
    const newParticipant: Participant = {
      name: participantName.trim(),
      role: participantRole.trim(),
    };
    setFormData((prev) => ({
      ...prev!,
      participants: [...prev!.participants, newParticipant],
    }));
    setParticipantName("");
    setParticipantRole("");
  };

  const removeParticipant = (index: number) => {
    setFormData((prev) => ({
      ...prev!,
      participants: prev!.participants.filter((_, i) => i !== index),
    }));
  };

  const addStakeholder = () => {
    if (!stakeholderName.trim()) return;
    const newStakeholder = {
      name: stakeholderName.trim(),
      role: stakeholderRole,
      influence: stakeholderInfluence,
    };
    setFormData((prev) => ({
      ...prev!,
      stakeholders: [...(prev!.stakeholders || []), newStakeholder],
    }));
    setStakeholderName("");
    setStakeholderRole(stakeholderRoles[0]);
    setStakeholderInfluence(0);
  };

  const removeStakeholder = (index: number) => {
    setFormData((prev) => ({
      ...prev!,
      stakeholders: prev!.stakeholders?.filter((_, i) => i !== index),
    }));
  };

  const projectRequirements = requirements.filter((r) => r.projectId === existingProject?.id);
const projectNeeds = needs;

const nodes: Node[] = [
  {
    id: `project-${existingProject?.id}`,
    data: { label: `${existingProject?.title}` },
    position: { x: 0, y: 0 },
    sourcePosition: Position.Bottom,
    style: {
      background: "#d1e7dd",
      border: "2px solid #333",
      borderRadius: "10px",
      padding: "10px",
      fontWeight: "bold",
    },
  },
  ...projectNeeds.map((need, index) => ({
    id: `need-${need.id}`,
    data: { label: `${need.title}` },
    position: { x: index * 300 + 100, y: 400 },
    sourcePosition: Position.Top,
    style: {
      background: "#d0e6ff",
      border: "2px dashed #1e3a8a",
      borderRadius: "10px",
      padding: "10px",
      fontWeight: "bold",
    },
  })),
  ...projectRequirements.map((req, index) => ({
    id: `req-${req.id}`,
    data: { label: `${req.title}\n${req.type === "Функциональное" ? "Ф" : "НФ"}` },
    position: { x: index * 300, y: 300 },
    targetPosition: Position.Top, 
    sourcePosition: Position.Top,
    style: {
      background: req.type === "Функциональное" ? "#e0f7fa" : "#ffe0b2",
      border: "2px solid #333",
      borderRadius: "10px",
      padding: "10px",
      fontWeight: "bold",
    },
  })),
];

const edges: Edge[] = [
  // проект → требования
  ...projectRequirements.map((req) => ({
    id: `edge-project-req-${req.id}`,
    source: `project-${existingProject?.id}`,
    target: `req-${req.id}`,
    type: "smoothstep",
    animated: false,
  })),
  // потребности → требования
  ...projectRequirements
    .filter((req) => req.needId)
    .map((req) => ({
      id: `edge-need-${req.needId}-req-${req.id}`,
      source: `need-${req.needId}`,
      target: `req-${req.id}`,
      type: "step",
      animated: true,
    })),
  // требования ↔ требования
  ...projectRequirements.flatMap((req) =>
    req.relatedRequirements.map((relId) => ({
      id: `edge-req-${req.id}-rel-${relId}`,
      source: `req-${req.id}`,
      target: `req-${relId}`,
      type: "straight",
      animated: true,
    }))
  ),
];

  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isNew ? "Создание проекта" : isEditing ? "Редактирование проекта" : "Просмотр проекта"}
      </h2>

      <Button variant="secondary" onClick={() => navigate("/projects")} className="mb-4">
        Назад ко всем проектам
      </Button>

      {!isNew && !isEditing && (
        <div className="flex flex-col gap-2 mb-4">
          <Button onClick={() => setShowDescription((prev) => !prev)}>Описание проекта</Button>
          <Button onClick={() => navigate(`/glossary/${id}`)}>Перейти в глоссарий</Button>
          <Button onClick={() => navigate(`/specification/${id}`)}>Перейти в спецификацию</Button>
          <Button onClick={() => setIsEditing(true)}>Редактировать</Button>
          <Button variant="danger" onClick={handleDelete}>Удалить проект</Button>
        </div>
      )}

      {showDescription && existingProject && (
        <div className="mb-6 p-6 border rounded-lg bg-white w-full max-w-5xl mx-auto">
          <h3 className="text-xl font-semibold mb-2">Название:</h3>
          <p className="mb-4 whitespace-pre-line">{existingProject.title}</p>

          <h3 className="text-xl font-semibold mb-2">Краткое описание:</h3>
          <p className="mb-4 whitespace-pre-line">{existingProject.shortDescription}</p>

          <h3 className="text-xl font-semibold mb-2">Дедлайн:</h3>
          <p className="mb-4">{existingProject.deadline}</p>

          <h3 className="text-xl font-semibold mb-2">Статус:</h3>
          <p className="mb-4">{existingProject.status}</p>

          <h3 className="text-xl font-semibold mb-2">Описание:</h3>
          <p className="mb-4 whitespace-pre-line">{existingProject.description}</p>

          <h3 className="text-xl font-semibold mb-2">Участники:</h3>
          {existingProject.participants.length > 0 ? (
            <ul className="mb-4">
              {existingProject.participants.map((p, i) => (
                <li key={i}>{p.name} ({p.role})</li>
              ))}
            </ul>
          ) : (
            <p className="mb-4 text-gray-500">Нет участников</p>
          )}

          <h3 className="text-xl font-semibold mb-2">Стейкхолдеры:</h3>
          {existingProject.stakeholders && existingProject.stakeholders.length > 0 ? (
            <ul className="mb-4">
              {existingProject.stakeholders.map((s, i) => (
                <li key={i}>{s.name} ({s.role})</li>
              ))}
            </ul>
          ) : (
            <p className="mb-4 text-gray-500">Нет стейкхолдеров</p>
          )}

          {/* <h3 className="text-xl font-semibold mb-2">Атрибуты:</h3>
          {existingProject.attributes.length > 0 ? (
            <ul className="mb-4">
              {existingProject.attributes.map((attr, i) => (
                <li key={i}>{attr}</li>
              ))}
            </ul>
          ) : (
            <p className="mb-4 text-gray-500">Нет атрибутов</p>
          )} */}
        </div>
      )}

      {isEditing && formData && (
        <div className="space-y-4">
          <Input label="Название *" value={formData.title ?? ""} onChange={(e) => handleChange("title", e.target.value)} />
          <Input label="Краткое описание *" value={formData.shortDescription ?? ""} onChange={(e) => handleChange("shortDescription", e.target.value)} />
          <DatePicker label="Дедлайн *" value={formData.deadline} onChange={(e) => handleChange("deadline", e.target.value)} />
          <Select label="Статус *" options={statusOptions} value={formData.status} onChange={(val) => handleChange("status", val)} />
          <TextArea label="Описание" value={formData.description ?? ""} onChange={(e) => handleChange("description", e.target.value)} />

          <div>
            <h3 className="font-semibold">Участники</h3>
            <div className="flex gap-2 mb-2">
              <Input placeholder="Имя" value={participantName} onChange={(e) => setParticipantName(e.target.value)} />
              <Input placeholder="Роль" value={participantRole} onChange={(e) => setParticipantRole(e.target.value)} />
              <Button onClick={addParticipant}>Добавить</Button>
            </div>
            <ul>
              {formData.participants.map((p, i) => (
                <li key={i} className="flex justify-between border-b py-1">
                  {p.name} ({p.role})
                  <Button variant="danger" onClick={() => removeParticipant(i)}>Удалить</Button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Стейкхолдеры</h3>
            <div className="flex gap-2 mb-2">
              <Input placeholder="Имя" value={stakeholderName} onChange={(e) => setStakeholderName(e.target.value)} />
              <Select options={stakeholderRoles.map(r => ({ value: r, label: r }))} value={stakeholderRole} onChange={(val) => setStakeholderRole(val as string)} />
              <Button onClick={addStakeholder}>Добавить</Button>
            </div>
            <ul>
              {formData.stakeholders?.map((s, i) => (
                <li key={i} className="flex justify-between border-b py-1">
                  {s.name} ({s.role})
                  <Button variant="danger" onClick={() => removeStakeholder(i)}>Удалить</Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSubmit} disabled={!isFormValid()}>Сохранить</Button>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>Отмена</Button>
          </div>
        </div>
      )}

      {!isEditing && (
        <div style={{ width: "100%", height: "600px" }} className="border rounded-xl my-6 bg-white">
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      )}
    </div>
  );
}
