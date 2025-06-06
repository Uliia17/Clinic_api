import { apiService } from "./apiService";
import { urls } from "../constants/urls";
import { IRes } from "../types/respType";
import { IAuth } from "../interfaces/authInterface";
import { ITokens } from "../interfaces/tokenInterface";
import {IDoctor} from "../interfaces/doctorInterface";

const _accessToken = 'accessToken';
const _refreshToken = 'refreshToken';

const authService = {
    register(doctor: IAuth): IRes<IDoctor> {
        return apiService.post(urls.auth.register, doctor);
    },

    async login(doctor: IAuth): Promise<IDoctor> {
        const { data } = await apiService.post<ITokens>(urls.auth.login, doctor);
        this.setTokens(data);
        const { data: me } = await this.me();
        return me;
    },

    setTokens({ tokens: { accessToken, refreshToken } }: ITokens): void {
        localStorage.setItem(_accessToken, accessToken);
        localStorage.setItem(_refreshToken, refreshToken);
    },

    me(): IRes<IDoctor> {
        return apiService.get(urls.auth.me);
    },

    getAccessToken(): string {
        return localStorage.getItem(_accessToken) || '';
    },

    getRefreshToken(): string {
        return localStorage.getItem(_refreshToken) || '';
    }
};

export {
    authService
};
