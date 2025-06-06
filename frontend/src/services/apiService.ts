import axios from "axios";
import {authService} from "./authService";

const apiService = axios.create({baseURL: process.env.REACT_APP_BASE_URL});


apiService.interceptors.request.use(req => {
    const accessToken = authService.getAccessToken();

    if (accessToken) {
        req.headers.Authorization = `Bearer ${accessToken}`
    }

    return req
})
export {
    apiService
}