"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import type { SignupData } from "../../types/auth";
import { toast } from "react-hot-toast";
import { navigateTo } from "../../utils/navigation";



const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);

export default function Signup()
{
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupData>();

  const onSubmit = async (data: SignupData) =>
  {
    try
    {
      await signup(data);
      toast.success("Account created successfully");
      navigateTo("/login");
    } catch (err: any)
    {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8
  border border-neutral-200 shadow-lg
  dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-none">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Create an Account
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Fill in your details below to get started
      </p>

      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>

        {/* Name Row */}
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              placeholder="John"
              type="text"
              {...register("name", {
                required: "First name is required",
                minLength: { value: 3, message: "At least 3 characters" },
              })}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </LabelInputContainer>

        </div>

        {/* Email */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="john@example.com"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
            })}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </LabelInputContainer>

        {/* Password */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </LabelInputContainer>

        {/* Confirm Password */}
        <LabelInputContainer className="mb-8">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            placeholder="••••••••"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (val) =>
                val === watch("password") || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </LabelInputContainer>

        {/* Submit */}
        <button
          disabled={isSubmitting}
          type="submit"
          className="cursor-pointer relative block h-10 w-full rounded-md 
    font-medium transition duration-300

    bg-neutral-900 text-white hover:bg-neutral-700
    
    dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200

    disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating account..." : "Create Account →"}
        </button>

        <p className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}