import { TagOption } from "./components/ui/TagSelector";

export interface Tag {
  id: number;
  name: string;
  color: string;
}

// ==== PROJECT ====

export interface Project {
  id: number;
  title: string;
  shortDescription: string;
  deadline: string;
  participants: Participant[];
  status: string;
  description?: string;
  goal?: string;
  stages?: string[];
  stakeholders?: { name: string; role: string; influence: number }[];
  glossary?: string[];
  specification?: string;
  attachedDocuments?: string[];
  activityLog?: string[];
  attributes: string[];
}

export interface ProjectCreate {
  title: string;
  shortDescription: string;
  deadline: string;
  participants: Participant[];
  status: string;
  description?: string;
  goal?: string;
  stages?: string[];
  stakeholders?: { name: string; role: string; influence: number }[];
  glossary?: string[];
  specification?: string;
  attachedDocuments?: string[];
  activityLog?: string[];
  attributes: string[];
}

// ==== REQUIREMENT ====

export interface Requirement {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  descriptionTemplate: string;
  responsible: string[];
  projectId: number;
  needId?: number;
  projectStage: string;
  deadlines: string;
  status: string;
  priority: string;
  attributes: string[];
  relatedRequirements: number[];
  notes: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
  versionHistory: VersionEntry[];
  tags: TagOption[];
  type: "Функциональное" | "Нефункциональное";
  stakeholderType: "internal" | "external";

}

export interface RequirementCreate {
  title: string;
  shortDescription: string;
  description: string;
  descriptionTemplate: string;
  responsible: string[];
  projectId: number;
  needId?: number;
  projectStage: string;
  deadlines: string;
  status: string;
  priority: string;
  attributes: string[];
  relatedRequirements: number[];
  notes: string;
  creator: string;
  tags: TagOption[];
  type: "Функциональное" | "Нефункциональное";
  stakeholderType: "internal" | "external";
}

// ==== VERSION ====

export interface VersionEntry {
  version?: number;
  timestamp: string;
  changes: string;
}

// ==== NEED ====

export interface Need {
  projectId: number;
  id: number;
  title: string;
  description: string;
  importance: string;
  attributes: string[];
  responsible: string;
  status: string;
  startDate: string;
  endDate: string;
  priority: string;
  requirementId?: number;
  creator: string;
  createdAt: string;
  updatedAt: string;
  versionHistory: VersionEntry[];
  attachedDocuments: string[];
}

export interface NeedCreate {
  projectId: number;
  title: string;
  description: string;
  importance: string;
  attributes: string[];
  responsible: string;
  status: string;
  startDate: string;
  endDate: string;
  priority: string;
  requirementId?: number;
  creator: string;
  attachedDocuments: string[];
}

// ==== Participant ====

export interface Participant {
  name: string;
  role: string;
}

// ==== Glossary ====

export interface GlossaryItem {
  id: number;
  term: string;
  definition: string;
  project: string;
}

export interface GlossaryItemCreate {
  term: string;
  definition: string;
  project: string;
}


export type { TagOption };
