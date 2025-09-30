import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return null; // El routing se encargará de redirigir
  }

  return isLogin ? (
    <LoginPage onSwitchToRegister={() => setIsLogin(false)} />
  ) : (
    <RegisterPage onSwitchToLogin={() => setIsLogin(true)} />
  );
};