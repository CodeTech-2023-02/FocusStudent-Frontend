import { useMutation } from "react-query";


import { studentRepository } from "../repositories/student-repository";
import { IStudent } from "../constants/interfaces";

export function useGetAllStudents() {
    return useMutation<IStudent[], Error, void>({
        mutationFn: () =>
            studentRepository.getAll().then((response) => response.body),
    });
}
