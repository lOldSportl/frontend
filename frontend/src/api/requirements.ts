import { Requirement, RequirementCreate } from "../types";
import { mockDatabase } from "./mockDatabase";

export async function fetchRequirements(): Promise<Requirement[]> {
  return Promise.resolve(mockDatabase.requirements);
}

export async function getRequirementById(id: number): Promise<Requirement | undefined> {
  return Promise.resolve(mockDatabase.requirements.find((r) => r.id === id));
}

export async function addRequirement(data: RequirementCreate): Promise<Requirement> {
  const newRequirement: Requirement = {
    ...data,
    id: mockDatabase.requirementIdCounter++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    versionHistory: [],
  };

  mockDatabase.requirements.push(newRequirement);
  return Promise.resolve(newRequirement);
}

export async function updateRequirement(updated: Requirement): Promise<void> {
  mockDatabase.requirements = mockDatabase.requirements.map((r) =>
    r.id === updated.id ? updated : r
  );
  return Promise.resolve();
}

export async function deleteRequirement(id: number): Promise<void> {
  mockDatabase.requirements = mockDatabase.requirements.filter((r) => r.id !== id);
  return Promise.resolve();
}
