export interface IClinic {
    _id: string | null;
    name: string;
    address: string | null;
    phone: string | null;
    createdAt: string;
    updatedAt: string;
    doctors?: string[];
    services?: string[];
}