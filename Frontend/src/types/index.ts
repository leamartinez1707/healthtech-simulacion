export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  dateOfBirth?: string;
  specialization?: string; // Para médicos
  licenseNumber?: string; // Para médicos
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: 'presencial' | 'virtual';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  videoRoomId?: string; // Para citas virtuales
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  diagnosis: string;
  treatment: string;
  prescriptions?: Prescription[];
  notes: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

export interface DoctorSchedule {
  doctorId: string;
  date: string;
  slots: TimeSlot[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'appointment-reminder' | 'appointment-confirmed' | 'appointment-cancelled';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AppointmentFormData {
  doctorId: string;
  date: string;
  time: string;
  type: 'presencial' | 'virtual';
  reason: string;
}