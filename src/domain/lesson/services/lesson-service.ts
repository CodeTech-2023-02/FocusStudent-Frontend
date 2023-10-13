import { useMutation } from "react-query";
import { lessonRepository } from "../repositories/lesson-repository";
import { GetLessons, ILesson, ILessonResponse } from "../constants/interfaces";

export function useCreateLesson() {
  return useMutation<ILessonResponse, Error, ILesson>({
    mutationFn: (data: ILesson) =>
      lessonRepository.create(data).then((response) => response.body),
  });
}

export function useEditLesson() {
  return useMutation<
  ILessonResponse,
    Error,
    { lessonId: number; data: ILesson }
  >({
    mutationFn: ({ lessonId, data }) =>
    lessonRepository.edit(lessonId, data).then((response) => response.body),
  });
}

export function useDeleteLesson() {
  return useMutation<ILessonResponse, Error, number>({
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
    lessonRepository.getLessonsByCourseSection(courseSectionId).then((response) => response.body),
  });
}