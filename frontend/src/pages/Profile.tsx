import React from "react";
import Switch from "../components/ui/Switch"; 

interface ProfileProps {
  isDarkTheme: boolean;
  onThemeChange: (checked: boolean) => void;
}

const Profile: React.FC<ProfileProps> = ({ isDarkTheme, onThemeChange }) => {
  //const isLoggedIn = true;

  // if (!isLoggedIn) {
  //   return <div className="p-6 text-red-500">Вы не авторизованы.</div>;
  // }

  const handleThemeChange = (checked: boolean) => {
    onThemeChange(checked);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Профиль</h1>
      <p className="mb-4">Добро пожаловать! Здесь вы можете редактировать свою информацию.</p>

      <div className="mb-6">
        <label className="flex items-center gap-4">
          <span>Тема:</span>
          <Switch checked={isDarkTheme} onChange={handleThemeChange} mode="theme" />
        </label>
      </div>

      <p>Дополнительные настройки будут добавлены позднее.</p>
    </div>
  );
};

export default Profile;
