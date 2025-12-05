import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const { login, isLoggingIn } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error("Будь ласка, заповніть всі поля");
            return;
        }

        await login(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
            <div className="w-full max-w-md">
                <div className="bg-base-100 rounded-lg shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                                <LogIn className="w-8 h-8 text-primary-content" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold">Вхід</h1>
                        <p className="text-base-content/60 mt-2">
                            Увійдіть у систему управління складом
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <input
                                type="email"
                                className="input input-bordered w-full"
                                placeholder="admin@warehouse.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Пароль</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input input-bordered w-full pr-10"
                                    placeholder="••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-base-content/40" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                "Увійти"
                            )}
                        </button>
                    </form>

                    {/* Signup Link */}
                    <div className="text-center mt-6">
                        <p className="text-base-content/60">
                            Немає облікового запису?{" "}
                            <Link to="/signup" className="link link-primary">
                                Зареєструватись
                            </Link>
                        </p>
                    </div>

                    {/* Test Accounts Info */}
                    <div className="mt-8 p-4 bg-base-200 rounded-lg">
                        <p className="text-sm font-semibold mb-2">Тестові облікові записи:</p>
                        <div className="space-y-1 text-xs">
                            <p>👤 admin@warehouse.com / 123456</p>
                            <p>👤 manager@warehouse.com / 123456</p>
                            <p>👤 employee@warehouse.com / 123456</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;