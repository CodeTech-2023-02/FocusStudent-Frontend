import { Control } from "react-hook-form";

export interface IUsersForm {
  id?: number;
  names: string;
  lastNames: string;
  phoneNumber: string;
  email: string;
  dni: string;
  address: string;
  password?: string;
  sectionId: number | null;
  studentId: number | null;
}

export interface UserFormStrategy {
  renderExtraFields: (control: Control<{
    sectionId?: number;
    id?: number;
    names?: string;
    lastNames?: string;
    phoneNumber?: string;
    email?: string;
    dni?: string;
    address?: string;
    password?: string;
    studentId?: number;
  }>) => JSX.Element | null;
  transformSubmitData: (data: IUsersForm) => IUsersForm;
}
