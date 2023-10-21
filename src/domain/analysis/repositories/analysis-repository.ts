import { axiosHttpClient } from "../../../infra/http/axios-http-client";
import { UtilsHttp } from "../../../infra/http/utils";
import {
    HttpClient,
    HttpMethod,
    HttpResponse
} from "../../../infra/interfaces";
import { AnalysisEndpoints } from "../constants/endpoint";
import { IAnalysis } from "../constants/interfaces";


const HOST_API = import.meta.env.VITE_APP_API;

function buildUrl(...args: string[]): string {
  return HOST_API + args.join("/");
}

class AnalysisRepository {
  constructor(private httpClient: HttpClient) {}


  useGetAnalysis = (
    faceStatus: string,
  ): Promise<HttpResponse<IAnalysis[]>> => {
    const url = buildUrl(
      AnalysisEndpoints.analysis, faceStatus
    );
    const headers = UtilsHttp.BaseHeaders();
    return this.httpClient.request({
      method: HttpMethod.GET,
      url,
      headers,
    });
  };
}

const analysisRepository = new AnalysisRepository(axiosHttpClient);

export { AnalysisRepository, analysisRepository };

