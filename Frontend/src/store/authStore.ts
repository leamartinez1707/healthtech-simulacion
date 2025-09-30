import { create } from 'zustand';
import type { User } from '../types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => void;
}

// Mock de datos de usuarios para el MVP
const mockUsers: User[] = [
  {
    id: '1',
    email: 'paciente@example.com',
    firstName: 'Juan',
    lastName: 'Pérez',
    role: 'patient',
    phone: '+34 600 123 456',
    dateOfBirth: '1985-03-15',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'doctor@example.com',
    firstName: 'Dra. María',
    lastName: 'González',
    role: 'doctor',
    phone: '+34 600 654 321',
    specialization: 'Cardiología',
    licenseNumber: 'COL12345',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
  },
];

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    // Simulación de autenticación
    const user = mockUsers.find(u => u.email === email);
    if (user && password === '123456') { // Mock password
      set({ user, isAuthenticated: true });
      localStorage.setItem('auth-user', JSON.stringify(user));
      return true;
    }
    return false;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('auth-user');
  },

  register: async (userData) => {
    // Simulación de registro
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    set({ user: newUser, isAuthenticated: true });
    localStorage.setItem('auth-user', JSON.stringify(newUser));
    return true;
  },

  updateProfile: (userData) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() };
      set({ user: updatedUser });
      localStorage.setItem('auth-user', JSON.stringify(updatedUser));
      
      // Actualizar en mock data
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
    }
  },
}));

// Inicializar usuario desde localStorage
const storedUser = localStorage.getItem('auth-user');
if (storedUser) {
  try {
    const user = JSON.parse(storedUser);
    useAuthStore.setState({ user, isAuthenticated: true });
  } catch {
    localStorage.removeItem('auth-user');
  }
}