import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Requirements from "./pages/Requirements";
import RequirementDetails from "./pages/RequirementDetails";
import Needs from "./pages/Needs";
import NeedDetails from "./pages/NeedDetails";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
import Specification from "./pages/Specification";
import Glossary from "./pages/Glossary";
import { DataProvider } from "./context/DataProvider";

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    return localStorage.getItem("darkTheme") === "true";
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Обновление размера окна
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDesktop = windowWidth >= 768;

  // Применение темы
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkTheme) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkTheme", String(isDarkTheme));
  }, [isDarkTheme]);

  return (
    <DataProvider>
      <Router>
        <Header
          isDesktop={isDesktop}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="layout bg-white dark:bg-[#1e1e1e] text-black dark:text-white min-h-screen">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isDarkTheme={isDarkTheme}
            isDesktop={isDesktop}
          />

          <main className="flex-1 pt-[60px] px-6 transition-all duration-300">
            <Routes>
              <Route path="/" element={<Projects />} />
              {/* <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} /> */}
              <Route
                path="/profile"
                element={
                  <Profile
                    isDarkTheme={isDarkTheme}
                    onThemeChange={setIsDarkTheme}
                  />
                }
              />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/projects/new" element={<ProjectDetails />} />
              <Route path="/requirements" element={<Requirements />} />
              <Route
                path="/requirements/:id"
                element={<RequirementDetails />}
              />
              <Route path="/needs" element={<Needs />} />
              <Route path="/needs/:id" element={<NeedDetails />} />
              <Route path="/needs/new" element={<NeedDetails />} />
              <Route
                path="/specification/:projectId"
                element={<Specification />}
              />
              <Route path="/glossary/:id" element={<Glossary />} />
            </Routes>
          </main>
        </div>
      </Router>
      <div className="hidden translate-x-0 -translate-x-full" />
    </DataProvider>
  );
};

export default App;
