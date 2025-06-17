import React from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  isDesktop: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  isDesktop,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] z-[1000] bg-blue-600 text-white flex items-center px-4 shadow-md">
      {!isDesktop && (
        <div
          className="flex flex-col justify-around w-[30px] h-[20px] cursor-pointer mr-4"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <div className="bg-white h-[3px] rounded"></div>
          <div className="bg-white h-[3px] rounded"></div>
          <div className="bg-white h-[3px] rounded"></div>
        </div>
      )}
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-bold cursor-pointer "
      >
        Система управления требованиями
      </h1>
    </header>
  );
};

export default Header;
