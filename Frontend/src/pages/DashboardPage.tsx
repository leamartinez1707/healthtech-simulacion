import React from 'react';
import { useAuthStore } from '../store/authStore';
import { PatientDashboard } from './PatientDashboard';
import { DoctorDashboard } from './DoctorDashboard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return user.role === 'patient' ? <PatientDashboard /> : <DoctorDashboard />;
};