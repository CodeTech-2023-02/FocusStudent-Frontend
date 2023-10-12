import { useMutation } from "react-query";
import { teacherRepository } from "../repositories/teacher-repository";
import { ITeacher } from "../constants/interfaces";


export function useGetAllTeachers() {
  return useMutation<ITeacher[], Error, void>({
    mutationFn: () =>
      teacherRepository.getAll().then((response) => response.body),
  });
}