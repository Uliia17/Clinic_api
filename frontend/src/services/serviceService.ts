import {IRes} from "../types/respType";
import {apiService} from "./apiService";
import {urls} from "../constants/urls";
import {IService} from "../interfaces/serviceInterface";

const serviceService = {
    create(data: IService): IRes<IService> {
        return apiService.post<IService>(urls.services, data);
    },
    getAll(): IRes<IService[]> {
        return apiService.get(urls.services)
    }
}

export {
    serviceService
}