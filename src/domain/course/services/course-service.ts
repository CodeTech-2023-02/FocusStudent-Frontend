import { useMutation } from "react-query";
import { courseRepository } from "../repositories/course-repository";
import { ICreateEditCourse, IRegisterResponse } from "../constants/interfaces";



export function useCreateCourse() {
  return useMutation<IRegisterResponse, Error, ICreateEditCourse>({
    mutationFn: (data: ICreateEditCourse) => courseRepository.create(data).then(response => response.body)
  });
}

export function useEditCourse() {
    return useMutation<IRegisterResponse, Error, { courseId: number, data: ICreateEditCourse }>({
      mutationFn: ({ courseId, data }) => courseRepository.edit(courseId, data).then(response => response.body)
    });
  }
  
  export function useDeleteCourse() {
    return useMutation<IRegisterResponse, Error, number>({
      mutationFn: (courseId: number) => courseRepository.delete(courseId).then(response => response.body)
    });
  }
