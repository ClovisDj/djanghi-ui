import axios from "axios";
import TokenManager from "./authToken";

const tokenManager = new TokenManager();

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_HOST ? process.env.REACT_APP_API_HOST : "http://localhost:8080"
});

axiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = `JWT ${tokenManager.getStoredAuthToken()}`
    return config;
});


class ApiClient {
    constructor() {
        this.axios = axiosInstance;
        this.tokenManager = tokenManager;
    }

    refreshToken = async () => {
        let refreshData;
        if (this.tokenManager.canRefreshAuthToken() && this.tokenManager.shouldRefreshAuthToken()) {
            try {
                refreshData = await this.axios.post(
                    "refresh_token",
                    {refresh: tokenManager.getStoredRefreshToken()}
                );
            } catch (error) {
                console.log(error);
            }
            if (refreshData) {
                await tokenManager.storeAuthToken(refreshData.data.data.access);
            }
        }
    }

    genericPost = async (method, url, data) => {
        await this.refreshToken();
        let responseData;
        try {
            responseData = await this.axios[method](url, data);
        }
        catch (error) {
            console.log(error);
        }
        return responseData ? responseData.data : null;
    }

    post = async (url, data) => {
        return await this.genericPost("post", url, data);
    }

    patch = async (url, data) => {
        return await this.genericPost("patch", url, data);
    }

    put = async (url, data) => {
        return await this.genericPost("put", url, data);
    }

    get = async (url, params = {}) => {
        await this.refreshToken();

        let responseData;
        try {
            responseData = await this.axios.get(url, params);
        }
        catch (error) {
            console.log(error);
        }
        return responseData ? responseData.data : null;
    }

    delete = async (url, params = {}) => {
        await this.refreshToken();

        let responseData;
        try {
            responseData = await this.axios.delete(url, params);
        }
        catch (error) {
            console.log(error);
        }
        return responseData ? responseData : null;
    }
}

export default ApiClient;
