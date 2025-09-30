import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { Card, CardHeader, Badge, Button } from '../components/ui';
import { formatDateTime, getStatusText } from '../utils';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { appointments, loading, fetchAppointments } = useAppointmentStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchAppointments(user.id);
    }
  }, [user, fetchAppointments]);

  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'scheduled')
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
    .slice(0, 3);

  const recentAppointments = appointments
    .filter(apt => apt.status === 'completed')
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {user?.firstName}
        </h1>
        <p className="text-gray-600">Gestiona tus citas médicas y revisa tu historial</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Próximas citas</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingAppointments.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Citas completadas</p>
              <p className="text-2xl font-semibold text-gray-900">{recentAppointments.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Médicos consultados</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(appointments.map(apt => apt.doctorId)).size}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader
          title="Próximas citas"
          subtitle="Tus citas programadas"
          action={
            <Button size="sm" onClick={() => navigate('/appointments')}>
              Nueva cita
            </Button>
          }
        />
        
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay citas programadas</h3>
            <p className="mt-1 text-sm text-gray-500">Programa tu primera cita médica</p>
            <div className="mt-6">
              <Button onClick={() => navigate('/appointments')}>
                Programar cita
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {formatDateTime(appointment.date, appointment.time)}
                      </p>
                      <p className="text-sm text-gray-500">{appointment.reason}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={appointment.type === 'virtual' ? 'info' : 'default'}>
                          {appointment.type === 'virtual' ? 'Virtual' : 'Presencial'}
                        </Badge>
                        <Badge variant="success">
                          {getStatusText(appointment.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button size="sm" variant="outline">
                    Ver detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Appointments */}
      {recentAppointments.length > 0 && (
        <Card>
          <CardHeader
            title="Historial reciente"
            subtitle="Tus últimas citas médicas"
            action={
              <Button size="sm" variant="outline" onClick={() => navigate('/medical-history')}>
                Ver todo
              </Button>
            }
          />
          
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {formatDateTime(appointment.date, appointment.time)}
                      </p>
                      <p className="text-sm text-gray-500">{appointment.reason}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={appointment.type === 'virtual' ? 'info' : 'default'}>
                          {appointment.type === 'virtual' ? 'Virtual' : 'Presencial'}
                        </Badge>
                        <Badge variant="success">
                          Completada
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};