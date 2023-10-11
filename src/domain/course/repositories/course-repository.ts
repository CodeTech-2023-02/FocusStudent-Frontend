import { axiosHttpClient } from "../../../infra/http/axios-http-client";
import { UtilsHttp } from "../../../infra/http/utils";
import {
  HttpClient,
  HttpMethod,
  HttpResponse,
} from "../../../infra/interfaces";
import { CourseEndpoints } from "../constants/endpoint";
import { ICreateEditCourse, IGetAllResponse, IRegisterResponse } from "../constants/interfaces";

const HOST_API = import.meta.env.VITE_APP_API;

function buildUrl(...args: string[]): string {
  return HOST_API + args.join("/");
}

class CourseRepository {
  constructor(private httpClient: HttpClient) {}

  create = (
    data: ICreateEditCourse
  ): Promise<HttpResponse<IRegisterResponse>> => {
    const url = buildUrl(CourseEndpoints.course);
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.POST,
      url,
      headers,
      body: data,
    });
  };

  edit = (
    courseId: number,
    data: ICreateEditCourse
  ): Promise<HttpResponse<IRegisterResponse>> => {
    const url = buildUrl(CourseEndpoints.course, courseId.toString());
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.PUT,
      url,
      headers,
      body: data,
    });
  };

  delete = (courseId: number): Promise<HttpResponse<IRegisterResponse>> => {
    const url = buildUrl(CourseEndpoints.course, courseId.toString());
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.DELETE,
      url,
      headers,
    });
  };

  getAll = (): Promise<HttpResponse<IGetAllResponse[]>> => {
    const url = buildUrl(CourseEndpoints.course);
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.GET,
      url,
      headers,
    });
  }
}

const courseRepository = new CourseRepository(axiosHttpClient);

export { CourseRepository, courseRepository };
