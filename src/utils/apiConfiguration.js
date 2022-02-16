import axios from "axios";
import TokenManager from "./authToken";


const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_HOST ? process.env.REACT_APP_API_HOST : "http://localhost:8080"
});

const tokenManager = new TokenManager();

axiosInstance.defaults.headers.common['Authorization'] = tokenManager.getStoredAuthToken();

export default axiosInstance;

