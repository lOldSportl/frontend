// components/AuthForm.tsx — универсальная форма авторизации и регистрации

import React, { useState } from 'react';
import Field from './ui/Field';
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validate = () => {
    if (!email.includes('@')) return 'Некорректный email';
    if (password.length < 6) return 'Пароль слишком короткий';
    if (mode === 'register' && password !== confirmPassword) return 'Пароли не совпадают';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);
    setError('');

    if (mode === 'login') {
      console.log('Логин:', { email, password });
      navigate('/');
    } else {
      console.log('Регистрация:', { email, password });
      navigate('/login');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white dark:bg-[#2c2c2c] rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {mode === 'login' ? 'Вход в систему' : 'Регистрация'}
      </h2>

      <form onSubmit={handleSubmit}>
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Field
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {mode === 'register' && (
          <Field
            label="Повторите пароль"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

        <Button type="submit" className="w-full">
          {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        {mode === 'login' ? (
          <p>
            Нет аккаунта?{' '}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setMode('register')}
            >
              Зарегистрируйтесь
            </button>
          </p>
        ) : (
          <p>
            Уже есть аккаунт?{' '}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setMode('login')}
            >
              Войдите
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
