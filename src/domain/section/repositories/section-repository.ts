import { axiosHttpClient } from "../../../infra/http/axios-http-client";
import { UtilsHttp } from "../../../infra/http/utils";
import {
  HttpClient,
  HttpMethod,
  HttpResponse,
} from "../../../infra/interfaces";
import { SectionEndpoints } from "../constants/endpoint";
import { ISection, ISectionGet, ISectionResponse } from "../constants/interfaces";

const HOST_API = import.meta.env.VITE_APP_API;

function buildUrl(...args: string[]): string {
  return HOST_API + args.join("/");
}

class SectionRepository {
  constructor(private httpClient: HttpClient) {}

  create = (
    data: ISection
  ): Promise<HttpResponse<ISectionResponse>> => {
    const url = buildUrl(SectionEndpoints.section);
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
    data: ISection
  ): Promise<HttpResponse<ISectionResponse>> => {
    const url = buildUrl(SectionEndpoints.section, courseId.toString());
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.PUT,
      url,
      headers,
      body: data,
    });
  };

  delete = (courseId: number): Promise<HttpResponse<ISectionResponse>> => {
    const url = buildUrl(SectionEndpoints.section, courseId.toString());
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.DELETE,
      url,
      headers,
    });
  };

  getAll = (): Promise<HttpResponse<ISectionGet[]>> => {
    const url = buildUrl(SectionEndpoints.section);
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.GET,
      url,
      headers,
    });
  }
}

const sectionRepository = new SectionRepository(axiosHttpClient);

export { SectionRepository, sectionRepository };
