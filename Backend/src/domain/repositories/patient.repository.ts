import type { Patient } from "../entities/patient.entity";

export interface patient_repository {
  get_all_Patients: () => Promise<Patient[] | null>;
  search_patient: (id: string) => Promise<Patient | null>;
  create_patient: (patient: Patient) => Promise<Patient>;
  update_patient: (patient: Patient) => Promise<Patient>;
  delete_patient: (id: string) => Promise<null>;
}
