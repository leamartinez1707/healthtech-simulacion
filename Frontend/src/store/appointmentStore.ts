import { create } from 'zustand';
import type { Appointment, User, DoctorSchedule } from '../types';
import { generateId } from '../utils';

interface AppointmentStore {
  appointments: Appointment[];
  doctors: User[];
  schedules: DoctorSchedule[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchAppointments: (userId?: string) => void;
  fetchDoctors: () => void;
  createAppointment: (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<boolean>;
  cancelAppointment: (id: string) => Promise<boolean>;
  getDoctorSchedule: (doctorId: string, date: string) => DoctorSchedule | null;
  getAvailableSlots: (doctorId: string, date: string) => string[];
}

// Mock data
const mockDoctors: User[] = [
  {
    id: '2',
    email: 'doctor@example.com',
    firstName: 'Dra. María',
    lastName: 'González',
    role: 'doctor',
    specialization: 'Cardiología',
    licenseNumber: 'COL12345',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '3',
    email: 'doctor2@example.com',
    firstName: 'Dr. Carlos',
    lastName: 'Rodríguez',
    role: 'doctor',
    specialization: 'Medicina General',
    licenseNumber: 'COL67890',
    createdAt: '2024-01-12T08:00:00Z',
    updatedAt: '2024-01-12T08:00:00Z',
  },
];

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '2',
    date: '2025-10-15',
    time: '10:00',
    type: 'presencial',
    status: 'scheduled',
    reason: 'Consulta de rutina',
    createdAt: '2025-09-01T09:00:00Z',
    updatedAt: '2025-09-01T09:00:00Z',
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '2',
    date: '2025-09-15',
    time: '14:30',
    type: 'virtual',
    status: 'completed',
    reason: 'Control cardiológico',
    notes: 'Paciente en buen estado general. Presión arterial normal. Se recomienda continuar con medicación actual.',
    createdAt: '2025-09-01T08:00:00Z',
    updatedAt: '2025-09-15T14:30:00Z',
  },
  {
    id: '3',
    patientId: '1',
    doctorId: '3',
    date: '2025-08-20',
    time: '09:00',
    type: 'presencial',
    status: 'completed',
    reason: 'Consulta de medicina general',
    notes: 'Revisión general. Paciente presenta síntomas leves de gripe. Se prescribe descanso y medicación sintomática.',
    createdAt: '2025-08-10T10:00:00Z',
    updatedAt: '2025-08-20T09:00:00Z',
  },
  {
    id: '4',
    patientId: '1',
    doctorId: '2',
    date: '2025-07-10',
    time: '16:00',
    type: 'virtual',
    status: 'cancelled',
    reason: 'Seguimiento cardiológico',
    notes: 'Cita cancelada por el paciente con 24h de anticipación.',
    createdAt: '2025-07-01T11:00:00Z',
    updatedAt: '2025-07-09T12:00:00Z',
  },
  {
    id: '5',
    patientId: '1',
    doctorId: '3',
    date: '2025-06-25',
    time: '11:30',
    type: 'presencial',
    status: 'completed',
    reason: 'Revisión de exámenes de laboratorio',
    notes: 'Resultados de laboratorio dentro de parámetros normales. Se recomienda control en 6 meses.',
    createdAt: '2025-06-15T09:00:00Z',
    updatedAt: '2025-06-25T11:30:00Z',
  }
];

const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 8; hour < 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: mockAppointments,
  doctors: mockDoctors,
  schedules: [],
  loading: false,
  error: null,

  fetchAppointments: (userId) => {
    set({ loading: true });
    // Simulación de fetch
    setTimeout(() => {
      let filteredAppointments = mockAppointments;
      if (userId) {
        filteredAppointments = mockAppointments.filter(
          apt => apt.patientId === userId || apt.doctorId === userId
        );
      }
      set({ appointments: filteredAppointments, loading: false });
    }, 500);
  },

  fetchDoctors: () => {
    set({ doctors: mockDoctors });
  },

  createAppointment: async (appointmentData) => {
    set({ loading: true, error: null });
    
    try {
      const newAppointment: Appointment = {
        ...appointmentData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockAppointments.push(newAppointment);
      set({ 
        appointments: [...mockAppointments],
        loading: false 
      });
      
      return true;
    } catch {
      set({ 
        error: 'Error al crear la cita',
        loading: false 
      });
      return false;
    }
  },

  updateAppointment: async (id, data) => {
    set({ loading: true, error: null });
    
    try {
      const appointmentIndex = mockAppointments.findIndex(apt => apt.id === id);
      if (appointmentIndex !== -1) {
        mockAppointments[appointmentIndex] = {
          ...mockAppointments[appointmentIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        
        set({ 
          appointments: [...mockAppointments],
          loading: false 
        });
        return true;
      }
      return false;
    } catch {
      set({ 
        error: 'Error al actualizar la cita',
        loading: false 
      });
      return false;
    }
  },

  cancelAppointment: async (id) => {
    return get().updateAppointment(id, { status: 'cancelled' });
  },

  getDoctorSchedule: (doctorId, date) => {
    const { schedules } = get();
    return schedules.find(schedule => 
      schedule.doctorId === doctorId && schedule.date === date
    ) || null;
  },

  getAvailableSlots: (doctorId, date) => {
    const allSlots = generateTimeSlots();
    const doctorAppointments = mockAppointments.filter(
      apt => apt.doctorId === doctorId && 
             apt.date === date && 
             apt.status === 'scheduled'
    );
    
    const bookedTimes = doctorAppointments.map(apt => apt.time);
    return allSlots.filter(slot => !bookedTimes.includes(slot));
  },
}));