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
    begin = 0,
    middle = 1,
    end = 2
}

export enum ConcentrateStatus {
    desconcentrate = 0,
    concentrate = 1
}

export enum FaceStatus {
    neutral = 0,
    happy = 1,
    sad = 2,
    angry = 3,
    fearful = 4,
    disgusted = 5,
    surprised = 6
}

export interface Analysis {
    timeStatus:        number;
    concentrateStatus: number;
    faceStatus:        number;
}

export interface StudentAnalysis {
    studentId: number;
    analysis: Analysis[];  
    start: Date;
    end: Date;
  }
  