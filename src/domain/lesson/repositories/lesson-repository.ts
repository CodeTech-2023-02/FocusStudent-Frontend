import { axiosHttpClient } from "../../../infra/http/axios-http-client";
import { UtilsHttp } from "../../../infra/http/utils";
import {
  HttpClient,
  HttpMethod,
  HttpResponse,
} from "../../../infra/interfaces";
import { LessonEndpoints } from "../constants/endpoint";
import { GetLessons, ILesson, ILessonResponse } from "../constants/interfaces";

const HOST_API = import.meta.env.VITE_APP_API;

function buildUrl(...args: string[]): string {
  return HOST_API + args.join("/");
}

class LessonRepository {
  constructor(private httpClient: HttpClient) {}

  create = (data: ILesson): Promise<HttpResponse<ILessonResponse>> => {
    const url = buildUrl(LessonEndpoints.lesson);
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.POST,
      url,
      headers,
      body: data,
    });
  };

  edit = (
    lessonId: number,
    data: ILesson
  ): Promise<HttpResponse<ILessonResponse>> => {
    const url = buildUrl(LessonEndpoints.lesson, lessonId.toString());
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.PUT,
      url,
      headers,
      body: data,
    });
  };

  delete = (lessonId: number): Promise<HttpResponse<ILessonResponse>> => {
    const url = buildUrl(LessonEndpoints.lesson, lessonId.toString());
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.DELETE,
      url,
      headers,
    });
  };

  getLessons = (): Promise<HttpResponse<GetLessons[]>> => {
    const url = buildUrl(LessonEndpoints.lesson);
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.GET,
      url,
      headers,
    });
  };

  getLessonsByCourseSection = (
    courseSectionId: number
  ): Promise<HttpResponse<GetLessons[]>> => {
    const url = buildUrl(
      LessonEndpoints.lesson,
      LessonEndpoints.courseSection,
      courseSectionId.toString()
    );
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.GET,
      url,
      headers,
    });
  };
}

const lessonRepository = new LessonRepository(axiosHttpClient);

export { LessonRepository, lessonRepository };
