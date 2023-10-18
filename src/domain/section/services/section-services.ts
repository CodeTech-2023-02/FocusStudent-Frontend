import { useMutation } from "react-query";
import { sectionRepository } from "../repositories/section-repository";
import { ISection, ISectionGet } from "../constants/interfaces";
import { GenericResponse } from "../../../infra/interfaces";

export function useCreateSection() {
  return useMutation<GenericResponse, Error, ISection>({
    mutationFn: (data: ISection) =>
      sectionRepository.create(data).then((response) => response.body),
  });
}

export function useEditSection() {
  return useMutation<
    GenericResponse,
    Error,
    { sectionId: number; data: ISection }
  >({
    mutationFn: ({ sectionId, data }) =>
      sectionRepository.edit(sectionId, data).then((response) => response.body),
  });
}

export function useDeleteSection() {
  return useMutation<GenericResponse, Error, number>({
    mutationFn: (sectionId: number) =>
      sectionRepository.delete(sectionId).then((response) => response.body),
  });
}

export function useGetAllSections() {
  return useMutation<ISectionGet[], Error, void>({
    mutationFn: () =>
      sectionRepository.getAll().then((response) => response.body),
  });
}
