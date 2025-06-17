import { Project, ProjectCreate } from "../types";
import { mockDatabase } from "./mockDatabase";

export async function fetchProjects(): Promise<Project[]> {
  return Promise.resolve(mockDatabase.projects);
}

export async function getProjectById(id: number): Promise<Project | undefined> {
  return Promise.resolve(mockDatabase.projects.find(p => p.id === id));
}

export async function addProject(project: ProjectCreate): Promise<Project> {
  const newProject: Project = {
    id: mockDatabase.projectIdCounter++,
    ...project,
  };
  mockDatabase.projects.push(newProject);
  return Promise.resolve(newProject);
}

export async function updateProject(updatedProject: Project): Promise<void> {
  mockDatabase.projects = mockDatabase.projects.map(p =>
    p.id === updatedProject.id ? updatedProject : p
  );
  return Promise.resolve();
}

export async function deleteProject(id: number): Promise<void> {
  mockDatabase.projects = mockDatabase.projects.filter(p => p.id !== id);
  return Promise.resolve();
}
