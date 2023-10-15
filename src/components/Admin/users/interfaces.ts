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
  sectionId?: number;
}

export interface UserFormStrategy {
  renderExtraFields: (control: Control<IUsersForm>) => JSX.Element | null;
  transformSubmitData: (data: IUsersForm) => IUsersForm;
}
