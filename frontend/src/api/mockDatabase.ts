import { Project, Requirement, Need } from "../types";

export const mockDatabase = {
  projects: [] as Project[],
  requirements: [] as Requirement[],
  needs: [] as Need[],
  
  projectIdCounter: 1,
  requirementIdCounter: 1,
  needIdCounter: 1,
};
