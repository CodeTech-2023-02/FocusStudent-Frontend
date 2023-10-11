import axios from "axios";
import {
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from "../interfaces";

class AxiosHttpClient implements HttpClient {
  async request<T, R>(data: HttpRequest<T>): Promise<HttpResponse<R>> {
    const { method, url, headers, body, params } = data;
    const response = await axios({ method, url, headers, data: body, params });
    return {
      statusCode: response.status as HttpStatusCode,
      body: response.data,
    };
  }
}

const axiosHttpClient = new AxiosHttpClient();

export { AxiosHttpClient, axiosHttpClient };
