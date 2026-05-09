import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

import type { registrationInterface } from "../interface/registrations.interface";
import apiClient from "../utils/apiClient";
import toast from "react-hot-toast";

const registrationValidate = yup.object({
  name: yup.string().required("Name is required").min(3),
  email: yup.string().required("Email is required").email(),
  password: yup
    .string()
    .required("Password is required")
    .min(8)
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/[0-9]/)
    .matches(/[@$!%*?&]/),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required(),
  DOB: yup
    .date()
    .typeError("Date of Birth is required")
    .required()
    .max(new Date(), "DOB cannot be in the future"),
});

const Registration = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registrationInterface>({
    resolver: yupResolver(registrationValidate),
  });

  const onSubmit = async (data: registrationInterface) => {
    try {
      // Don't send status field - Laravel doesn't expect it
      const { confirmPassword, ...registrationData } = data;
      const result = await apiClient.post(
        "/api/auth/register",
        registrationData,
      );

      if (result.data.success) {
        toast.success(result.data.message);
        navigate("/login");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.errors?.[
          Object.keys(error.response.data.errors)[0]
        ]?.[0] ||
        "Registration failed. Please try again.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center">
      {/* Card */}
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 shadow-xl rounded-2xl">
        {/* Card */}

        {/* Header with accent */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Registration</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? "border-red-500 focus:ring-red-300 bg-red-50"
                    : "border-gray-300 focus:ring-blue-400 focus:border-blue-400"
                }`}
              />
            </div>
            {errors.name && (
              <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-red-300 bg-red-50"
                    : "border-gray-300 focus:ring-blue-400 focus:border-blue-400"
                }`}
              />
            </div>
            {errors.email && (
              <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? "border-red-500 focus:ring-red-300 bg-red-50"
                    : "border-gray-300 focus:ring-blue-400 focus:border-blue-400"
                }`}
              />
            </div>
            {errors.password && (
              <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-300 bg-red-50"
                    : "border-gray-300 focus:ring-blue-400 focus:border-blue-400"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                {...register("DOB", {
                  setValueAs: (value) => (value ? new Date(value) : null),
                })}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.DOB
                    ? "border-red-500 focus:ring-red-300 bg-red-50"
                    : "border-gray-300 focus:ring-blue-400 focus:border-blue-400"
                }`}
              />
            </div>
            {errors.DOB && (
              <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                {errors.DOB.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Create Account
          </button>

          {/* Login Link */}
          <div className="pt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
