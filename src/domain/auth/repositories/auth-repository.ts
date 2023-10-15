import { axiosHttpClient } from "../../../infra/http/axios-http-client";
import { UtilsHttp } from "../../../infra/http/utils";
import {
  HttpClient,
  HttpMethod,
  HttpResponse,
} from "../../../infra/interfaces";
import { AuthEndpoints } from "../constants/endpoint";
import {
  IChangePassword,
  IGetUsers,
  ILogin,
  ILoginResponse,
  IRegister,
  IRegisterResponse,
  IUpdateUser,
} from "../constants/interfaces";

const HOST_API = import.meta.env.VITE_APP_API;

function buildUrl(...args: string[]): string {
  return HOST_API + args.join("/");
}

class AuthRepository {
  constructor(private httpClient: HttpClient) {}

  login = (data: ILogin): Promise<HttpResponse<ILoginResponse>> => {
    const url = buildUrl(AuthEndpoints.user, AuthEndpoints.login);
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.POST,
      url,
      headers,
      body: data,
    });
  };

  register = (data: IRegister): Promise<HttpResponse<IRegisterResponse>> => {
    const url = buildUrl(AuthEndpoints.user, AuthEndpoints.register);
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.POST,
      url,
      headers,
      body: data,
    });
  };

  changePassword = (
    id: number,
    data: IChangePassword
  ): Promise<HttpResponse<IRegisterResponse>> => {
    const url = buildUrl(
      AuthEndpoints.user,
      id.toString(),
      AuthEndpoints.password
    );
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.PUT,
      url,
      headers,
      body: data,
    });
  };

  updateUser = (
    id: number,
    data: IUpdateUser
  ): Promise<HttpResponse<IRegisterResponse>> => {
    const url = buildUrl(AuthEndpoints.user, id.toString());
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.PUT,
      url,
      headers,
      body: data,
    });
  };

  getAllUsersByLastNamesAndRole = (
    lastNames: string,
    role: string
  ): Promise<HttpResponse<IGetUsers[]>> => {
    const url = buildUrl(
      AuthEndpoints.user,
      AuthEndpoints.rol,
      role,
      AuthEndpoints.lastnames,
      lastNames
    );
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.GET,
      url,
      headers,
    });
  };
}

const authRepository = new AuthRepository(axiosHttpClient);

export { AuthRepository, authRepository };
