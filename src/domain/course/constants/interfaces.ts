export interface ICreateEditCourse {
  year: number;
  name: string;
  description: string;
}

export interface IRegisterResponse {
  message: string;
}

export interface IGetAllResponse {
  id: number;
  name: string;
  year: number;
  description: string;
}
