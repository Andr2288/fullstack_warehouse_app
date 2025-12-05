import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",
    //withCredentials: true
});

// Додаємо токен до кожного запиту
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);