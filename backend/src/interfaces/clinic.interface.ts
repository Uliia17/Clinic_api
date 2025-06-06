import { IBase } from "./base.interface";

interface IClinic extends IBase {
    _id: string;
    name: string;
    doctors: string[];
}

type IClinicDTO = Pick<IClinic, "name">;

export { IClinic, IClinicDTO };
