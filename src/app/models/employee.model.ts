export interface Employee {
  id?: number;         // Optional (used for edit/delete)
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  department: string;
  salary: number;
}
