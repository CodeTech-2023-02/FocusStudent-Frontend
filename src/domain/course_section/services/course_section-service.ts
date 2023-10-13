import { useMutation } from "react-query";
import { courseSectionRepository } from "../repositories/course_section-repository";
import {
  ICourseSection,
  ICourseSectionTeacher,
  IResponseCourseSection,
} from "../constants/interfaces";

export function useCreateCourseSection() {
  return useMutation<IResponseCourseSection, Error, ICourseSection[]>({
    mutationFn: (data: ICourseSection[]) =>
      courseSectionRepository
        .createCourseSection(data)
        .then((response) => response.body),
  });
}

export function useEditCourseSection() {
  return useMutation<IResponseCourseSection, Error, { data: ICourseSection[] }>(
    {
      mutationFn: ({ data }) =>
        courseSectionRepository
          .editCourseSection(data)
          .then((response) => response.body),
    }
  );
}

export function useDeleteCourseSection() {
  return useMutation<IResponseCourseSection, Error, number[]>({
    mutationFn: (courseSectionId: number[]) =>
      courseSectionRepository
        .deleteCourseSection(courseSectionId)
        .then((response) => response.body),
  });
}

export function useGetAllCoursesSection() {
  return useMutation<ICourseSectionTeacher[], Error, void>({
    mutationFn: () =>
      courseSectionRepository
        .getAllCourseSection()
        .then((response) => response.body),
  });
}

export function useGetAllCoursesSectionByTeacher() {
  return useMutation<ICourseSectionTeacher[], Error, number>({
    mutationFn: (teacherId: number) =>
      courseSectionRepository
        .getAllCourseSectionByTeacher(teacherId)
        .then((response) => response.body),
  });
}

export function useGetAllCoursesSectionBySection() {
  return useMutation<ICourseSectionTeacher[], Error, number>({
    mutationFn: (sectionId: number) =>
      courseSectionRepository
        .getAllCourseSectionBySection(sectionId)
        .then((response) => response.body),
  });
}
