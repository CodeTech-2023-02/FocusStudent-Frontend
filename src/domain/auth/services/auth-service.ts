import { useMutation } from "react-query";
import {
  IChangePassword,
  IGetUsers,
  ILogin,
  ILoginResponse,
  IRegister,
  IUpdateUser,
} from "../constants/interfaces";
import { authRepository } from "../repositories/auth-repository";
import { GenericResponse } from "../../../infra/interfaces";

export function useLogin() {
  return useMutation<ILoginResponse, Error, ILogin>({
    mutationFn: (data: ILogin) =>
      authRepository.login(data).then((response) => response.body),
  });
}

export function useRegister() {
  return useMutation<GenericResponse, Error, IRegister>({
    mutationFn: (data: IRegister) => {
      if (data.email.includes("_profesor")) {
        delete data.sectionId;
      }
      return authRepository.register(data).then((response) => response.body);
    },
  });
}

export function useGetAllUsersByLastNamesAndRole() {
  return useMutation<IGetUsers[], Error, { lastNames: string; role: string }>({
    mutationFn: ({ lastNames, role }) => {
      const cleanedLastNames = lastNames.trim();
      return authRepository
        .getAllUsersByLastNamesAndRole(cleanedLastNames, role)
        .then((response) => response.body);
    },
  });
}

export function useUpdateUser() {
  return useMutation<
  GenericResponse,
    Error,
    { id: number; data: IUpdateUser }
  >({
    mutationFn: ({ id, data }) =>
      authRepository.updateUser(id, data).then((response) => response.body),
  });
}

export function useChangePassword() {
  return useMutation<
  GenericResponse,
    Error,
    { id: number; data: IChangePassword }
  >({
    mutationFn: ({ id, data }) =>
      authRepository.changePassword(id, data).then((response) => response.body),
  });
}
