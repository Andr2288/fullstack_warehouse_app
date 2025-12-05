import {create} from "zustand"
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/profile");
            set({authUser: res.data.user});
        }
        catch (error) {
            set({authUser: null});
            console.log("Error in checkAuth", error);
        }
        finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async (data) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/register", data);
            set({authUser: res.data.user});
            toast.success("Обліковий запис успішно створено");
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Помилка реєстрації");
        }
        finally {
            set({isSigningUp: false});
        }
    },

    login: async (data) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data.user});

            // Зберігаємо токен
            localStorage.setItem("token", res.data.token);

            // Додаємо токен до заголовків axios
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

            toast.success("Успішний вхід");
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Помилка входу");
        }
        finally {
            set({isLoggingIn: false});
        }
    },

    logout: async () => {
        try {
            localStorage.removeItem("token");
            delete axiosInstance.defaults.headers.common['Authorization'];
            set({authUser: null});
            toast.success("Ви вийшли з системи");
        }
        catch (error) {
            toast.error("Помилка виходу");
        }
    }
}));