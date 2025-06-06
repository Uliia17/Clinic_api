export interface IDoctor {
    _id: string;
    email: string;
    name: string;
    surname: string;
    phone: string;
    role: string;
    clinics?: string[];
    services?: string[];
}