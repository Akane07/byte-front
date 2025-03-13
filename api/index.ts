import axios from "axios";

export const baseURL = `http://37.252.22.147`;
let api = axios.create({
    baseURL: baseURL + '/api/v1',
});

api.defaults.timeout = 10000;
api.interceptors.request.use((config) => {
    config.headers['Accept'] = '*/*';
    config.headers['Access-Control-Allow-Origin'] = '*';

    return config;
});

export function setToken(_token?: string) {
    const token = localStorage.getItem("byte-accessToken") || _token || "";
    if (token.length) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        api.defaults.headers.common['Authorization'] = ``;
    }
}

export { api };