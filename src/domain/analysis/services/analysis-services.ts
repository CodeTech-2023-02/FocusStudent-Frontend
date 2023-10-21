import { useMutation } from "react-query";
import { analysisRepository } from "../repositories/analysis-repository";
import { IAnalysis } from "../constants/interfaces";

export function useGetAnalysis() {
    return useMutation<IAnalysis[], Error, { faceStatus: string }>({
      mutationFn: ({ faceStatus }) => {
        
        return analysisRepository
          .useGetAnalysis(faceStatus)
          .then((response) => response.body);
      },
    });
  }