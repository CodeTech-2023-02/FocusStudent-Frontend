export interface ICourseForm {
  id?: number
  name: string;
  year: number;
  description: string;
  lessonDescription?: string | null;
}
