export type TrackingData = {
  studentId: number;
  trackingData: ExpressionData[];
};

export interface ExpressionData {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
}

export enum TimeStatus {
  begin = "BEGIN",
  middle = "MIDDLE",
  end = "END",
}

export enum ConcentrateStatus {
  desconcentrate = 0,
  concentrate = 1,
}

export enum FaceStatus {
  neutral = "NEUTRAL",
  happy = "HAPPY",
  sad = "SAD",
  angry = "ANGRY",
  fearful = "FEARFUL",
  disgusted = "DISGUSTED",
  surprised = "SURPRISED",
}

export interface Analysis {
  timeStatus: TimeStatus;
  concentrateStatus: ConcentrateStatus;
  faceStatus: FaceStatus;
}


export interface StudentAnalysis {
  studentId: number;
  analysis: Analysis[];
  start: Date;
  end: Date;
}
