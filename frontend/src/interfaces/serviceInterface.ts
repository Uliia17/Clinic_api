export interface IService {
    _id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
    address?: string[];   // ← масив
    phone?: string[];     // ← масив
    clinics?: string[];
    doctors?: string[];
}
