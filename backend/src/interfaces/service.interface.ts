import { IBase } from "./base.interface";

interface IService extends IBase {
    _id: string;
    name: string;
}

interface IServiceQuery {
    pageSize: number;
    page: number;
    search?: string;
    order?: string;
}

type IServiceDTO = Pick<IService, "name">;

export { IService, IServiceDTO, IServiceQuery };
