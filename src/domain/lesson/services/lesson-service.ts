import { useMutation } from "react-query";
import { lessonRepository } from "../repositories/lesson-repository";
import { GetLessons, ILesson } from "../constants/interfaces";
import { GenericResponse } from "../../../infra/interfaces";

export function useCreateLesson() {
  return useMutation<GenericResponse, Error, ILesson>({
    mutationFn: (data: ILesson) =>
      lessonRepository.create(data).then((response) => response.body),
  });
}

export function useEditLesson() {
  return useMutation<
    GenericResponse,
    Error,
    { lessonId: number; data: ILesson }
  >({
    mutationFn: ({ lessonId, data }) =>
      lessonRepository.edit(lessonId, data).then((response) => response.body),
  });
}

export function useDeleteLesson() {
  return useMutation<GenericResponse, Error, number>({
    mutationFn: (lessonId: number) =>
      lessonRepository.delete(lessonId).then((response) => response.body),
  });
}

export function useGetAllLessons() {
  return useMutation<GetLessons[], Error, void>({
    mutationFn: () =>
      lessonRepository.getLessons().then((response) => response.body),
  });
}

export function useGetLessonsByCourseSection() {
  return useMutation<GetLessons[], Error, number>({
    mutationFn: (courseSectionId: number) =>
      lessonRepository
        .getLessonsByCourseSection(courseSectionId)
        .then((response) => response.body),
  });
}
