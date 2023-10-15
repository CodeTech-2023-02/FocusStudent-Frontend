import { axiosHttpClient } from "../../../infra/http/axios-http-client";
import { UtilsHttp } from "../../../infra/http/utils";
import {
  GenericResponse,
  HttpClient,
  HttpMethod,
  HttpResponse,
} from "../../../infra/interfaces";
import { DetectorEndpoints } from "../constants/endpoint";
import { IAnalysis } from "../constants/interfaces";

const HOST_API = import.meta.env.VITE_APP_API;

function buildUrl(...args: string[]): string {
  return HOST_API + args.join("/");
}

class DetectorRepository {
  constructor(private httpClient: HttpClient) {}

  create = (data: IAnalysis): Promise<HttpResponse<GenericResponse>> => {
    const url = buildUrl(DetectorEndpoints.detector);
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.POST,
      url,
      headers,
      body: data,
    });
  };

}

const detectorRepository = new DetectorRepository(axiosHttpClient);

export { DetectorRepository, detectorRepository };
