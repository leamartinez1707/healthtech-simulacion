import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { Card, CardHeader, Badge } from '../components/ui';
import { formatDateTime } from '../utils';

export const MedicalHistoryPage: React.FC = () => {
  const { user } = useAuthStore();
  const { appointments, loading, fetchAppointments } = useAppointmentStore();
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (user) {
      fetchAppointments(user.id);
    }
  }, [user, fetchAppointments]);

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return appointment.status !== 'scheduled';
    return appointment.status === filter;
  }).sort((a, b) => 
    new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()
  );

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { variant: 'success' as const, text: 'Completada', icon: '✓' };
      case 'cancelled':
        return { variant: 'danger' as const, text: 'Cancelada', icon: '✕' };
      case 'no-show':
        return { variant: 'warning' as const, text: 'No asistió', icon: '!' };
      default:
        return { variant: 'default' as const, text: status, icon: '?' };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historial Médico</h1>
        <p className="text-gray-600">Revisa todas tus citas médicas anteriores</p>
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({appointments.filter(apt => apt.status !== 'scheduled').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completadas ({appointments.filter(apt => apt.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'cancelled'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Canceladas ({appointments.filter(apt => apt.status === 'cancelled').length})
          </button>
        </div>
      </Card>

      {/* Lista de citas */}
      <Card>
        <CardHeader
          title="Historial de Citas"
          subtitle={`${filteredAppointments.length} citas encontradas`}
        />

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron citas</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'No tienes historial médico aún'
                : `No tienes citas ${filter === 'completed' ? 'completadas' : 'canceladas'}`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const statusInfo = getStatusInfo(appointment.status);
              
              return (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold
                          ${appointment.status === 'completed' ? 'bg-success-500' : 
                            appointment.status === 'cancelled' ? 'bg-danger-500' : 'bg-warning-500'}
                        `}>
                          {statusInfo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-sm font-medium text-gray-900">
                              {formatDateTime(appointment.date, appointment.time)}
                            </h3>
                            <Badge variant={statusInfo.variant}>
                              {statusInfo.text}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{appointment.reason}</p>
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <div className={`
                              inline-flex items-center px-2 py-1 rounded-full
                              ${appointment.type === 'virtual' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                            `}>
                              {appointment.type === 'virtual' ? (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Virtual
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                  Presencial
                                </>
                              )}
                            </div>
                            
                            {user?.role === 'patient' && (
                              <div className="flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Médico ID: {appointment.doctorId}
                              </div>
                            )}
                          </div>

                          {appointment.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs font-medium text-gray-700 mb-1">Notas médicas:</p>
                              <p className="text-sm text-gray-600">{appointment.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Estadísticas */}
      {filteredAppointments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">
                {appointments.filter(apt => apt.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-500">Citas completadas</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-danger-600">
                {appointments.filter(apt => apt.status === 'cancelled').length}
              </div>
              <div className="text-sm text-gray-500">Citas canceladas</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {new Set(appointments.map(apt => apt.doctorId)).size}
              </div>
              <div className="text-sm text-gray-500">Médicos consultados</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};