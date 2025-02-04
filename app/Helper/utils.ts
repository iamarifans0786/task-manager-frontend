import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { BASE_URL } from "./Path";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const useApiClient = () => {
    const { token } = useAuth();

    const apiClient = axios.create({
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Add a request interceptor to include the Authorization token
    apiClient.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    return apiClient;
};


export function showErrorMessage(message: string): void {
    toast.error(message, {
        theme: "colored",
        style: {
            zIndex: 9999,
        }
    });
}

export function showSuccessMessage(message: string): void {
    toast.success(message, {
        theme: "colored",
        style: {
            zIndex: 9999,
            color: "#ffffff",
            background: "#1a202c",
        },
    });
}