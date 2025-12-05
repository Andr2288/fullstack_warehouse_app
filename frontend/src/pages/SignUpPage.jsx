import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "employee"
    });

    const { signup, isSigningUp } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            toast.error("Будь ласка, заповніть всі поля");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Пароль повинен містити не менше 6 символів");
            return;
        }

        await signup(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
            <div className="w-full max-w-md">
                <div className="bg-base-100 rounded-lg shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                                <UserPlus className="w-8 h-8 text-primary-content" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold">Реєстрація</h1>
                        <p className="text-base-content/60 mt-2">
                            Створіть обліковий запис
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Ім'я</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Іван Іваненко"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <input
                                type="email"
                                className="input input-bordered w-full"
                                placeholder="example@warehouse.com"
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

                        {/* Role */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Роль</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="employee">Співробітник</option>
                                <option value="manager">Менеджер</option>
                                <option value="admin">Адміністратор</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isSigningUp}
                        >
                            {isSigningUp ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                "Зареєструватись"
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center mt-6">
                        <p className="text-base-content/60">
                            Вже є обліковий запис?{" "}
                            <Link to="/login" className="link link-primary">
                                Увійти
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;