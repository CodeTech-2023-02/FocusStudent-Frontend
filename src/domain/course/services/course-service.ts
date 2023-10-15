import { useMutation } from "react-query";
import { courseRepository } from "../repositories/course-repository";
import {
  ICreateEditCourse,
  IGetAllResponse,
} from "../constants/interfaces";
import { GenericResponse } from "../../../infra/interfaces";

export function useCreateCourse() {
  return useMutation<GenericResponse, Error, ICreateEditCourse>({
    mutationFn: (data: ICreateEditCourse) =>
      courseRepository.create(data).then((response) => response.body),
  });
}

export function useEditCourse() {
  return useMutation<
  GenericResponse,
    Error,
    { courseId: number; data: ICreateEditCourse }
  >({
    mutationFn: ({ courseId, data }) =>
      courseRepository.edit(courseId, data).then((response) => response.body),
  });
}

export function useDeleteCourse() {
  return useMutation<GenericResponse, Error, number>({
    mutationFn: (courseId: number) =>
      courseRepository.delete(courseId).then((response) => response.body),
  });
}

export function useGetAllCourses() {
  return useMutation<IGetAllResponse[], Error, void>({
    mutationFn: () =>
      courseRepository.getAll().then((response) => response.body),
  });
}
