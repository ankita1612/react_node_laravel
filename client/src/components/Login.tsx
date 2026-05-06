import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import type { loginInterface } from "../interface/login.interface";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";
interface LoginFormData {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email address") // replaces your regex
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});
const Login = () => {
  const { setUserData } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: loginInterface) => {
    try {
      const userData = {
        email: data.email,
        password: data.password,
      };

      const result = await apiClient.post("/api/auth/login", userData);
      const apiUser = result.data.data.user;
      setUserData(apiUser);
      toast.success("Login successfully!"); // ✅ success toast

      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed"); // ✅ error toast
    }
  };
  // useEffect(() => {
  //   if (errors) {
  //     const firstError = Object.values(errors)[0];
  //     if (firstError?.message) {
  //       toast.error(firstError.message as string);
  //     }
  //   }
  // }, [errors]);
  const label_style = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="flex items-center justify-center">
      {/* Card */}
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 shadow-xl rounded-2xl">
        {/* Title Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* Email Field */}
          <div>
            <label htmlFor="email" className={label_style}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              autoComplete="email"
              className={`w-full px-4 py-3 rounded-xl bg-white border text-slate-900 placeholder-slate-400 
focus:outline-none focus:ring-2 transition text-sm 
disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200
${
  errors.email
    ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
    : "border-gray-300 focus:ring-primary/20 focus:border-primary/20"
}`}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className={label_style}>
                Password
              </label>
            </div>

            <input
              id="password"
              type={showPassword ? "text" : "password"} // 👈 toggle
              placeholder="Enter password"
              autoComplete="current-password"
              className={`w-full px-4 py-3 rounded-xl bg-white border text-slate-900 placeholder-slate-400 
focus:outline-none focus:ring-2 transition text-sm 
disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200
${
  errors.password
    ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
    : "border-gray-300 focus:ring-primary/20 focus:border-primary/20"
}`}
              {...register("password")}
            />

            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[45px] text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
