import React, { createContext, useContext, useEffect, useState } from "react";
import { Project, Requirement, Need } from "../types";
import { fetchProjects } from "../api/projects";
import { fetchRequirements } from "../api/requirements";
import { fetchNeeds } from "../api/needs";

// Интерфейс данных хранилища
interface DataContextType {
  projects: Project[];
  requirements: Requirement[];
  needs: Need[];
  refreshAll: () => void;
  isLoading: boolean;
}

// Создаём сам контекст
const DataContext = createContext<DataContextType | undefined>(undefined);

// Провайдер
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAll = () => {
    setIsLoading(true);
    Promise.all([
      fetchProjects().then(setProjects),
      fetchRequirements().then(setRequirements),
      fetchNeeds().then(setNeeds)
    ]).finally(() => setIsLoading(false));
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <DataContext.Provider value={{ projects, requirements, needs, refreshAll, isLoading }}>
      {children}
    </DataContext.Provider>
  );
};

// Хук для доступа к данным
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
