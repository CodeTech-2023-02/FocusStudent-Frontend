import { axiosHttpClient } from "../../../infra/http/axios-http-client";
import { UtilsHttp } from "../../../infra/http/utils";
import {
  HttpClient,
  HttpMethod,
  HttpResponse,
} from "../../../infra/interfaces";
import { CourseSectionEndpoints } from "../constants/endpoint";
import { ICourseSection, ICourseSectionTeacher, IResponseCourseSection } from "../constants/interfaces";

const HOST_API = import.meta.env.VITE_APP_API;

function buildUrl(...args: string[]): string {
  return HOST_API + args.join("/");
}

class CourseSectionRepository {
  constructor(private httpClient: HttpClient) {}

  createCourseSection = (
    data: ICourseSection
  ): Promise<HttpResponse<IResponseCourseSection>> => {
    const url = buildUrl(CourseSectionEndpoints.course_section);
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.POST,
      url,
      headers,
      body: data,
    });
  };

  editCourseSection = (
    courseSectionId: number,
    data: ICourseSection[]
  ): Promise<HttpResponse<ICourseSectionTeacher>> => {
    const url = buildUrl(CourseSectionEndpoints.course_section, courseSectionId.toString());
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.PUT,
      url,
      headers,
      body: data,
    });
  };

  deleteCourseSection = (courseSectionId: number): Promise<HttpResponse<IResponseCourseSection>> => {
    const url = buildUrl(CourseSectionEndpoints.course_section, courseSectionId.toString());
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.DELETE,
      url,
      headers,
    });
  };

  getAllCourseSection = (): Promise<HttpResponse<ICourseSectionTeacher[]>> => {
    const url = buildUrl(CourseSectionEndpoints.course_section);
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.GET,
      url,
      headers,
    });
  }

  getAllCourseSectionByTeacher = (teacherId: number): Promise<HttpResponse<ICourseSectionTeacher[]>> => {
    const url = buildUrl(CourseSectionEndpoints.course_section, CourseSectionEndpoints.teacher, teacherId.toString());
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.GET,
      url,
      headers,
    });
  }

  getAllCourseSectionBySection = (sectionId: number): Promise<HttpResponse<ICourseSectionTeacher[]>> => {
    const url = buildUrl(CourseSectionEndpoints.course_section, CourseSectionEndpoints.section, sectionId.toString());
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.GET,
      url,
      headers,
    });
  }

}

const courseSectionRepository = new CourseSectionRepository(axiosHttpClient);

export { CourseSectionRepository, courseSectionRepository };
