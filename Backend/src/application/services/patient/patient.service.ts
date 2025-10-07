import type { patient_repository } from "../../../domain/repositories/patient.repository";

export class exist_patient {
  private readonly _patient_repository: patient_repository;

  constructor(Patient_repository: patient_repository) {
    this._patient_repository = Patient_repository;
  }

  async run(id: string): Promise<boolean> {
    const patient = await this._patient_repository.search_patient(id);

    if (!patient) {
      return false;
    }

    return true;
  }
}
