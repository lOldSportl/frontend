import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme: boolean;
  isDesktop: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isDarkTheme,
  isDesktop,
}) => {
  const isLoggedIn = !!localStorage.getItem("token");

  const baseClasses = `
    w-[250px] p-5 pt-[60px] h-[100vh] overflow-y-auto relative
    ${
      isDarkTheme
        ? "bg-[#1a1a1a] text-white border-r border-[#2e2e2e]"
        : "bg-[#f1f3f6] text-black border-r border-[#d0d7e2]"
    }
  `;

  const classes = [
    baseClasses,
    "transition-transform duration-300 ease-in-out",
    "md:translate-x-0",
    !isDesktop ? "fixed top-[60px] left-0 z-[999]" : "",
    !isDesktop && isOpen ? "translate-x-0" : "",
    !isDesktop && !isOpen ? "-translate-x-full" : "",
  ].join(" ");

  return (
    <aside className={classes}>
      {/* {!isDesktop && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white text-2xl font-bold"
          aria-label="Закрыть меню"
        >
          ✕
        </button>
      )} */}

      <ul className="space-y-6 mt-4">
        <SidebarLinks isLoggedIn={isLoggedIn} onClose={onClose} />
      </ul>
    </aside>
  );
};

const SidebarLinks: React.FC<{
  isLoggedIn: boolean;
  onClose: () => void;
}> = ({ isLoggedIn, onClose }) => (
  <>
    <li>
      <Link to="/projects" onClick={onClose}>
        <Button fullWidth>Проекты</Button>
      </Link>
    </li>
    <li>
      <Link to="/requirements" onClick={onClose}>
        <Button fullWidth>Требования</Button>
      </Link>
    </li>
    <li>
      <Link to="/needs" onClick={onClose}>
        <Button fullWidth>Потребности</Button>
      </Link>
    </li>
    {isLoggedIn ? (
      <li>
        <Link to="/profile" onClick={onClose}>
          <Button fullWidth>Профиль</Button>
        </Link>
      </li>
    ) : (
      <>
        <li>
          <Link to="/login" onClick={onClose}>
            <Button fullWidth>Вход</Button>
          </Link>
        </li>
        <li>
          <Link to="/register" onClick={onClose}>
            <Button fullWidth>Регистрация</Button>
          </Link>
        </li>
      </>
    )}
  </>
);

export default Sidebar;
