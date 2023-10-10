import { HttpRequest, HttpResponse } from "./types";

export interface HttpClient {
  request: <T, R>(data: HttpRequest<T>) => Promise<HttpResponse<R>>;
}
