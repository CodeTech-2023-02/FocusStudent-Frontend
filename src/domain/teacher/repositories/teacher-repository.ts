import { axiosHttpClient } from "../../../infra/http/axios-http-client";
import { UtilsHttp } from "../../../infra/http/utils";
import {
  HttpClient,
  HttpMethod,
  HttpResponse,
} from "../../../infra/interfaces";
import { TeacherEndpoints } from "../constants/endpoint";
import { ITeacher } from "../constants/interfaces";

const HOST_API = import.meta.env.VITE_APP_API;

function buildUrl(...args: string[]): string {
  return HOST_API + args.join("/");
}

class TeacherRepository {
  constructor(private httpClient: HttpClient) {}

  getAll = (): Promise<HttpResponse<ITeacher[]>> => {
    const url = buildUrl(TeacherEndpoints.teacher);
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.GET,
      url,
      headers,
    });
  };
}

const teacherRepository = new TeacherRepository(axiosHttpClient);

export { TeacherRepository, teacherRepository };
