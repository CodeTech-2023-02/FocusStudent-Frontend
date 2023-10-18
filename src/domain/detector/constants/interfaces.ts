export interface IAnalysis {
  start: Date;
  end: Date;
  analyses: Analysis[];
  studentId: number;
  lessonId: number;
}

export interface Analysis {
  timeStatus: string;
  concentrateStatus: string;
  faceStatus: string;
}
