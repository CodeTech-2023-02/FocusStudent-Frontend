import { Roles } from "../../../constants/roles";

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  id: number;
  role: Roles;
  name: string;
}

export interface IRegister {
  names: string;
  lastNames: string;
  phoneNumber: string;
  dni: string;
  email: string;
  address: string;
  password: string;
  sectionId: number;
}

export interface IRegisterResponse {
  message: string;
}
