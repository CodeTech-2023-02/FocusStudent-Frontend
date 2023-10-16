import { axiosHttpClient } from "../../../infra/http/axios-http-client";
import { UtilsHttp } from "../../../infra/http/utils";
import {
  HttpClient,
  HttpMethod,
  HttpResponse
} from "../../../infra/interfaces";
import { StudentEndpoints } from "../constants/endpoint";
import { IStudent } from "../constants/interfaces";

const HOST_API = import.meta.env.VITE_APP_API;

function buildUrl(...args: string[]): string {
  return HOST_API + args.join("/");
}

class StudentRepository {
  constructor(private httpClient: HttpClient) {}

  getAll = (): Promise<HttpResponse<IStudent[]>> => {
    const url = buildUrl(StudentEndpoints.student);
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.GET,
      url,
      headers,
    });
  };

}

const studentRepository = new StudentRepository(axiosHttpClient);

export { StudentRepository, studentRepository };

