import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, Badge, Button } from '../components/ui';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  lastVisit?: string;
  status: 'active' | 'inactive';
  medicalRecord?: string;
}

export const PatientsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulamos la carga de pacientes
    const mockPatients: Patient[] = [
      {
        id: '1',
        firstName: 'Ana',
        lastName: 'García',
        email: 'ana.garcia@email.com',
        phone: '+34 600 123 456',
        dateOfBirth: '1985-03-15',
        lastVisit: '2024-01-15',
        status: 'active',
        medicalRecord: 'Hipertensión controlada'
      },
      {
        id: '2',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos.rodriguez@email.com',
        phone: '+34 600 789 012',
        dateOfBirth: '1978-07-22',
        lastVisit: '2024-01-10',
        status: 'active',
        medicalRecord: 'Diabetes tipo 2'
      },
      {
        id: '3',
        firstName: 'María',
        lastName: 'López',
        email: 'maria.lopez@email.com',
        phone: '+34 600 345 678',
        dateOfBirth: '1992-11-08',
        lastVisit: '2023-12-20',
        status: 'inactive',
        medicalRecord: 'Chequeo rutinario'
      },
      {
        id: '4',
        firstName: 'José',
        lastName: 'Martín',
        email: 'jose.martin@email.com',
        phone: '+34 600 901 234',
        dateOfBirth: '1965-05-12',
        lastVisit: '2024-01-08',
        status: 'active',
        medicalRecord: 'Artritis reumatoide'
      }
    ];

    setTimeout(() => {
      setPatients(mockPatients);
      setLoading(false);
    }, 500);
  }, []);

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (user?.role !== 'doctor') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">
          Acceso denegado. Solo los médicos pueden ver la lista de pacientes.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Pacientes</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos los pacientes asignados
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button className="bg-primary-600 hover:bg-primary-700 text-white">
            + Nuevo Paciente
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="max-w-md">
        <label htmlFor="search" className="sr-only">
          Buscar pacientes
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="search"
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Lista de pacientes */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {patient.firstName} {patient.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {calculateAge(patient.dateOfBirth)} años
                </p>
              </div>
              <Badge variant={patient.status === 'active' ? 'success' : 'warning'}>
                {patient.status === 'active' ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Contacto:</p>
                <p className="text-sm text-gray-600">{patient.email}</p>
                <p className="text-sm text-gray-600">{patient.phone}</p>
              </div>
              
              {patient.lastVisit && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Última visita:</p>
                  <p className="text-sm text-gray-600">{formatDate(patient.lastVisit)}</p>
                </div>
              )}
              
              {patient.medicalRecord && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Notas:</p>
                  <p className="text-sm text-gray-600">{patient.medicalRecord}</p>
                </div>
              )}
              
              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  Ver Historial
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                >
                  Nueva Cita
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.196M17 20v-2a3 3 0 00-3-3H8a3 3 0 00-3 3v2m14 0h-5m-9 0H5m12-12a4 4 0 11-8 0 4 4 0 018 0zM9 12h6m-6 0a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Intenta con otro término de búsqueda.' 
              : 'Comienza agregando un nuevo paciente.'
            }
          </p>
        </div>
      )}
    </div>
  );
};