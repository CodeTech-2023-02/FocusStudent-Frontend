import { HttpMethod, HttpStatusCode } from "./enums";

export type HttpResponse<T> = {
  statusCode: HttpStatusCode;
  body: T;
};

export type HttpRequest<T = BodyInit> = {
  url: string;
  method: HttpMethod;
  body?: T | Record<string, any>;
  headers?: Record<string, any>;
  params?: Record<string, any>;
};

export type GenericSuccessResponse = {
  code: number;
  status: string;
};

export interface GenericResponse{
  message: string;
}