import { Types } from "mongoose";

interface IService {
    _id?: Types.ObjectId;
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
