import { Need, NeedCreate } from "../types";
import { mockDatabase } from "./mockDatabase";

export async function fetchNeeds(): Promise<Need[]> {
  return Promise.resolve(mockDatabase.needs);
}

export async function getNeedById(id: number): Promise<Need | undefined> {
  return Promise.resolve(mockDatabase.needs.find((n) => n.id === id));
}

export async function addNeed(data: NeedCreate): Promise<Need> {
  const newNeed: Need = {
    ...data,
    id: mockDatabase.needIdCounter++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    versionHistory: [],
    //projectId: undefined
  };

  mockDatabase.needs.push(newNeed);
  return Promise.resolve(newNeed);
}

export async function updateNeed(updated: Need): Promise<void> {
  mockDatabase.needs = mockDatabase.needs.map((n) =>
    n.id === updated.id ? updated : n
  );
  return Promise.resolve();
}

export async function deleteNeed(id: number): Promise<void> {
  mockDatabase.needs = mockDatabase.needs.filter((n) => n.id !== id);
  return Promise.resolve();
}
