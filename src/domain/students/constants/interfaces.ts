export interface IStudent {
    id:      number;
    section: Section;
    user:    User;
}

export interface Section {
    id:   number;
    name: string;
}

export interface User {
    id:          number;
    names:       string;
    lastNames:   string;
    phoneNumber: string;
    dni:         string;
    email:       string;
    address:     string;
}