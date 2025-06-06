import {IRes} from "../types/respType";
import {apiService} from "./apiService";
import {urls} from "../constants/urls";
import {IClinic} from "../interfaces/clinicInterface";

const clinicService = {
    create(data: IClinic): IRes<IClinic> {
        return apiService.post<IClinic>(urls.clinics, data);
    },
    getAll(): IRes<IClinic[]> {
        return apiService.get(urls.clinics)
    }
}

export {
    clinicService
}