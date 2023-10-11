import { useMutation } from "react-query";
import {
  ILogin,
  ILoginResponse,
  IRegister,
  IRegisterResponse,
} from "../constants/interfaces";
import { authRepository } from "../repositories/auth-repository";

export function useLogin() {
  return useMutation<ILoginResponse, Error, ILogin>({
    mutationFn: (data: ILogin) =>
      authRepository.login(data).then((response) => response.body),
  });
}

export function useRegister() {
  return useMutation<IRegisterResponse, Error, IRegister>({
    mutationFn: (data: IRegister) =>
      authRepository.register(data).then((response) => response.body),
  });
}
