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
  studentId: number | null;
  teacherId: number | null;
}

export interface IRegister {
  names: string;
  lastNames: string;
  phoneNumber: string;
  dni: string;
  email: string;
  address: string;
  password: string;
  sectionId?: number;
}

export interface IUpdateUser {
  names: string;
  lastNames: string;
  phoneNumber: string;
  dni: string;
  email: string;
  address: string;
  sectionId: number;
  studentId: number;
}

export interface IChangePassword {
  password: string;
}

export interface IGetUsers {
  id: number;
  names: string;
  lastNames: string;
  phoneNumber: string;
  dni: string;
  email: string;
  address: string;
}
