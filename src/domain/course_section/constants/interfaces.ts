export interface ICourseSection {
  courseId: number;
  sectionId: number;
  teacherId: number;
}

export interface ICourseSectionTeacher {
  id: number;
  course: Course;
  section: Section;
  teacher: Teacher;
}

export interface Course {
  id: number;
  name: string;
  year: number;
  description: string;
}

export interface Section {
  id: number;
  name: string;
}

export interface Teacher {
  id: number;
  user: User;
}

export interface User {
  id: number;
  names: string;
  lastNames: string;
  phoneNumber: string;
  dni: string;
  email: string;
  address: string;
}
