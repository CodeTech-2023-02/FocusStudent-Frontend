import { axiosHttpClient } from "../../../infra/http/axios-http-client";
import { UtilsHttp } from "../../../infra/http/utils";
import { HttpClient, HttpMethod, HttpResponse } from "../../../infra/interfaces";
import { AuthEndpoints } from "../constants/endpoint";
import { ILogin, ILoginResponse, IRegister, IRegisterResponse } from "../constants/interfaces";

const HOST_API = import.meta.env.VITE_APP_API;

function buildUrl(...args: string[]): string {
  return HOST_API + args.join("/");
}

class AuthRepository {
  constructor(private httpClient: HttpClient) {}

  login = (data: ILogin): Promise<HttpResponse<ILoginResponse>> => {
    const url = buildUrl(AuthEndpoints.user,AuthEndpoints.login);
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.POST,
      url,
      headers,
      body: data,
    });
  };

  register = (data: IRegister): Promise<HttpResponse<IRegisterResponse>> => {
    const url = buildUrl(AuthEndpoints.user,AuthEndpoints.register);
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.POST,
      url,
      headers,
      body: data,
    });
  };
}

const authRepository = new AuthRepository(axiosHttpClient);

export { AuthRepository, authRepository };
