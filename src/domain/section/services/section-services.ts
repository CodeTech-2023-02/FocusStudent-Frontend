import { useMutation } from "react-query";
import { sectionRepository } from "../repositories/section-repository";
import {
  ISection,
  ISectionGet,
  ISectionResponse,
} from "../constants/interfaces";

export function useCreateSection() {
  return useMutation<ISectionResponse, Error, ISection>({
    mutationFn: (data: ISection) =>
      sectionRepository.create(data).then((response) => response.body),
  });
}

export function useEditSection() {
  return useMutation<
    ISectionResponse,
    Error,
    { sectionId: number; data: ISection }
  >({
    mutationFn: ({ sectionId, data }) =>
      sectionRepository.edit(sectionId, data).then((response) => response.body),
  });
}

export function useDeleteSection() {
  return useMutation<ISectionResponse, Error, number>({
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
