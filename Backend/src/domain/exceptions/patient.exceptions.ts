export class patient_exist_exception extends Error {
  constructor() {
    super("Patient already exist");
  }
}
