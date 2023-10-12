export interface ITeacher {
    id:   number;
    user: IUserTeacher;
}

export interface IUserTeacher {
    id:          number;
    names:       string;
    lastNames:   string;
    phoneNumber: string;
    dni:         string;
    email:       string;
    address:     string;
}
