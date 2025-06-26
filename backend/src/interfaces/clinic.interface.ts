import { Types } from "mongoose";

interface IClinic {
    _id?: Types.ObjectId;
    name: string;
    doctors: Types.ObjectId[];
}

type IClinicDTO = {
    name: string;
    doctors: string[];
};

export type { IClinic, IClinicDTO };
