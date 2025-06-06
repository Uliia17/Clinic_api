import {IRes} from "../types/respType";
import {apiService} from "./apiService";
import {urls} from "../constants/urls";
import {IDoctor} from "../interfaces/doctorInterface";

const doctorService = {
    create(data: IDoctor): IRes<IDoctor> {
        return apiService.post<IDoctor>(urls.doctors, data);
    },
    getAll(): IRes<IDoctor[]> {
        return apiService.get(urls.doctors)
    }
}

export {
    doctorService
}