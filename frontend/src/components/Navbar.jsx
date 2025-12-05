import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Package, User } from "lucide-react";

const Navbar = () => {
    const { authUser, logout } = useAuthStore();

    return (
        <div className="navbar bg-base-100 shadow-lg">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">
                    <Package className="w-6 h-6 mr-2" />
                    Склад
                </Link>
            </div>

            {authUser && (
                <div className="flex-none gap-2">
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
                            <div className="w-10 rounded-full bg-primary text-primary-content">
                                <User className="w-6 h-6" />
                            </div>
                        </label>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li className="menu-title">
                                <span>{authUser.name}</span>
                                <span className="text-xs opacity-60">{authUser.email}</span>
                            </li>
                            <li>
                                <span className="text-xs">
                                    Роль: {authUser.role === 'admin' ? 'Адміністратор' : authUser.role === 'manager' ? 'Менеджер' : 'Співробітник'}
                                </span>
                            </li>
                            <div className="divider my-1"></div>
                            <li>
                                <button onClick={logout}>
                                    <LogOut className="w-4 h-4" />
                                    Вийти
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;