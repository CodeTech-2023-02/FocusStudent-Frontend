import { useMutation } from "react-query";
import { IAnalysis } from "../constants/interfaces";
import { detectorRepository } from "../repositories/detector-repository";
import { GenericResponse } from "../../../infra/interfaces";

export function useCreateDetector() {
  return useMutation<GenericResponse, Error, IAnalysis>({
    mutationFn: (data: IAnalysis) =>
      detectorRepository.create(data).then((response) => response.body),
  });
}
