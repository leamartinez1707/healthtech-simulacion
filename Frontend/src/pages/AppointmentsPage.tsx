import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { Card, CardHeader, Button, Input, Modal } from '../components/ui';
import { formatDateTime } from '../utils';
import type { AppointmentFormData } from '../types';

export const AppointmentsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { appointments, doctors, loading, fetchAppointments, fetchDoctors, createAppointment, getAvailableSlots } = useAppointmentStore();
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState<AppointmentFormData>({
    doctorId: '',
    date: '',
    time: '',
    type: 'presencial',
    reason: '',
  });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      fetchAppointments(user.id);
      if (user.role === 'patient') {
        fetchDoctors();
      }
    }
  }, [user, fetchAppointments, fetchDoctors]);

  useEffect(() => {
    if (appointmentForm.doctorId && appointmentForm.date) {
      const slots = getAvailableSlots(appointmentForm.doctorId, appointmentForm.date);
      setAvailableSlots(slots);
      if (!slots.includes(appointmentForm.time)) {
        setAppointmentForm(prev => ({ ...prev, time: '' }));
      }
    }
  }, [appointmentForm.doctorId, appointmentForm.date, appointmentForm.time, getAvailableSlots]);

  const handleFormChange = (field: keyof AppointmentFormData, value: string) => {
    setAppointmentForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!appointmentForm.doctorId) newErrors.doctorId = 'Selecciona un médico';
    if (!appointmentForm.date) newErrors.date = 'Selecciona una fecha';
    if (!appointmentForm.time) newErrors.time = 'Selecciona una hora';
    if (!appointmentForm.reason.trim()) newErrors.reason = 'Describe el motivo de la consulta';

    // Validar que la fecha no sea en el pasado
    const selectedDate = new Date(appointmentForm.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.date = 'No puedes programar citas en fechas pasadas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    const success = await createAppointment({
      patientId: user.id,
      doctorId: appointmentForm.doctorId,
      date: appointmentForm.date,
      time: appointmentForm.time,
      type: appointmentForm.type,
      status: 'scheduled',
      reason: appointmentForm.reason.trim(),
    });

    if (success) {
      setShowNewAppointmentModal(false);
      setAppointmentForm({
        doctorId: '',
        date: '',
        time: '',
        type: 'presencial',
        reason: '',
      });
      setErrors({});
      if (user) {
        fetchAppointments(user.id);
      }
    }
  };

  const userAppointments = appointments.sort((a, b) => 
    new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()
  );

  const upcomingAppointments = userAppointments.filter(apt => apt.status === 'scheduled');
  const pastAppointments = userAppointments.filter(apt => apt.status !== 'scheduled');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Citas</h1>
          <p className="text-gray-600">Gestiona tus citas médicas</p>
        </div>
        {user?.role === 'patient' && (
          <Button onClick={() => setShowNewAppointmentModal(true)}>
            Nueva Cita
          </Button>
        )}
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader
          title="Próximas citas"
          subtitle={`${upcomingAppointments.length} citas programadas`}
        />
        
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay citas programadas</h3>
            <p className="mt-1 text-sm text-gray-500">
              {user?.role === 'patient' ? 'Programa tu primera cita médica' : 'No tienes citas programadas'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {formatDateTime(appointment.date, appointment.time)}
                        </p>
                        <p className="text-sm text-gray-600">{appointment.reason}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`
                            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${appointment.type === 'virtual' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                          `}>
                            {appointment.type === 'virtual' ? 'Virtual' : 'Presencial'}
                          </span>
                          {user?.role === 'patient' && (
                            <span className="text-xs text-gray-500">
                              Médico ID: {appointment.doctorId}
                            </span>
                          )}
                          {user?.role === 'doctor' && (
                            <span className="text-xs text-gray-500">
                              Paciente ID: {appointment.patientId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex space-x-2">
                    {appointment.type === 'virtual' && (
                      <Button size="sm" variant="primary">
                        {user?.role === 'doctor' ? 'Iniciar consulta' : 'Unirse'}
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Ver detalles
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <Card>
          <CardHeader
            title="Historial de citas"
            subtitle={`${pastAppointments.length} citas completadas`}
          />
          
          <div className="space-y-3">
            {pastAppointments.slice(0, 5).map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${appointment.status === 'completed' ? 'bg-green-100' : 'bg-red-100'}
                        `}>
                          <svg className={`
                            w-4 h-4 
                            ${appointment.status === 'completed' ? 'text-green-600' : 'text-red-600'}
                          `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {appointment.status === 'completed' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            )}
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {formatDateTime(appointment.date, appointment.time)}
                        </p>
                        <p className="text-sm text-gray-600">{appointment.reason}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`
                            inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                            ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                              'bg-gray-100 text-gray-800'}
                          `}>
                            {appointment.status === 'completed' ? 'Completada' :
                             appointment.status === 'cancelled' ? 'Cancelada' : 'No asistió'}
                          </span>
                          <span className={`
                            inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                            ${appointment.type === 'virtual' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                          `}>
                            {appointment.type === 'virtual' ? 'Virtual' : 'Presencial'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* New Appointment Modal */}
      <Modal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        title="Nueva Cita"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Médico
              </label>
              <select
                value={appointmentForm.doctorId}
                onChange={(e) => handleFormChange('doctorId', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecciona un médico</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                  </option>
                ))}
              </select>
              {errors.doctorId && <p className="mt-1 text-sm text-red-600">{errors.doctorId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de consulta
              </label>
              <select
                value={appointmentForm.type}
                onChange={(e) => handleFormChange('type', e.target.value as 'presencial' | 'virtual')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fecha"
              type="date"
              value={appointmentForm.date}
              onChange={(e) => handleFormChange('date', e.target.value)}
              error={errors.date}
              min={new Date().toISOString().split('T')[0]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora
              </label>
              <select
                value={appointmentForm.time}
                onChange={(e) => handleFormChange('time', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                disabled={!appointmentForm.date || !appointmentForm.doctorId}
              >
                <option value="">Selecciona una hora</option>
                {availableSlots.map(slot => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
              {appointmentForm.date && appointmentForm.doctorId && availableSlots.length === 0 && (
                <p className="mt-1 text-sm text-yellow-600">No hay horarios disponibles para esta fecha</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo de la consulta
            </label>
            <textarea
              value={appointmentForm.reason}
              onChange={(e) => handleFormChange('reason', e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe brevemente el motivo de tu consulta"
            />
            {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowNewAppointmentModal(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Programar Cita
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};