import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema } from "../schemas/login.schema";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import { User, Lock } from "lucide-react";

const Login = () => {
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            const res = await api.post("/api/auth/login", data);
            login(res.data.token);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
            <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />

            <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        {/* LEFT - Illustration */}
                        <div className="hidden lg:block">
                            <img
                                src="/ERP.png"
                                alt="ERP System Illustration"
                                className="w-full h-auto object-contain drop-shadow-2xl"
                            />
                        </div>

                        {/* RIGHT - Login Form */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl p-9 shadow-xl border border-gray-100">
                                {/* Brand */}
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold text-indigo-600 mb-1">Sharaco</h1>
                                    <p className="text-gray-500 text-xs uppercase tracking-widest font-medium">
                                        ERP System
                                    </p>
                                </div>

                                <h2 className="text-gray-800 text-2xl font-semibold text-center mb-8">
                                    Welcome back
                                </h2>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    {/* Email */}
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                                        <input
                                            type="email"
                                            placeholder="username"
                                            {...register("email")}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 pl-12 pr-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                                        <input
                                            type="password"
                                            placeholder="password"
                                            {...register("password")}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 pl-12 pr-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                                        />
                                        {errors.password && (
                                            <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.password.message}</p>
                                        )}
                                    </div>

                                    {/* Forgot password */}
                                    <div className="text-right">
                                        <Link
                                            to="/forgot-password"
                                            className="text-indigo-600 hover:text-indigo-800 text-sm transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-linear-to-r cursor-pointer from-indigo-600 to-blue-600 text-white font-semibold py-3.5 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 mt-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <svg
                                                    className="animate-spin h-5 w-5 text-white"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                        fill="none"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                    />
                                                </svg>
                                                Signing in...
                                            </div>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </button>

                                    {/* Register link */}
                                    <p className="text-center text-gray-600 mt-6 text-sm">
                                        Don't have an account?{" "}
                                        <Link
                                            to="/register"
                                            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                                        >
                                            Create one
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;