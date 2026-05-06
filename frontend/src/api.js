import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api", // Spring Boot
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor to include auth header
api.interceptors.request.use((config) => {
    const auth = localStorage.getItem("auth");
    if (auth) {
        config.headers.Authorization = `Basic ${auth}`;
    }
    return config;
});

export default api;