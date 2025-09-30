import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div>{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-semibold text-blue-600">
                  HealthTech Portal
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Hola, {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {user.role === 'patient' ? 'Paciente' : 
                 user.role === 'doctor' ? 'Médico' : 'Admin'}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => {
                console.log('Navigating to /dashboard');
                navigate('/dashboard');
              }}
              className={`py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                location.pathname === '/dashboard' || location.pathname === '/'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                console.log('Navigating to /appointments');
                navigate('/appointments');
              }}
              className={`py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                location.pathname === '/appointments'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Citas
            </button>
            {user.role === 'patient' && (
              <button
                onClick={() => {
                  console.log('Navigating to /medical-history');
                  navigate('/medical-history');
                }}
                className={`py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                  location.pathname === '/medical-history'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Historial médico
              </button>
            )}
            {user.role === 'doctor' && (
              <button
                onClick={() => navigate('/patients')}
                className={`py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                  location.pathname === '/patients'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pacientes
              </button>
            )}
            <button
              onClick={() => {
                console.log('Navigating to /profile');
                navigate('/profile');
              }}
              className={`py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                location.pathname === '/profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Perfil
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};