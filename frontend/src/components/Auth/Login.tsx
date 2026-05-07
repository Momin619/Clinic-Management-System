import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import type { LoginData } from "../../types/auth";
import { toast } from "react-hot-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
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

export default function Login()
{
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) =>
  {
    try
    {
      await login(data);
      toast.success("Login successful");
      navigateTo("/dashboard"); // update path as needed
    } catch (err: any)
    {
      toast.error(err.response?.data?.message || "Something went wrong dsdsd");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-8 py-10
      border border-neutral-200 shadow-lg
      dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-none">

      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome Back
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Enter your credentials to sign in
      </p>

      <form className="mt-6 mb-0" onSubmit={handleSubmit(onSubmit)}>

        {/* Email or Name */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="identifier">Email or Name</Label>
          <Input
            id="identifier"
            placeholder="john@example.com"
            type="text"
            {...register("identifier", {
              required: "Email or name is required",
            })}
          />
          {errors.identifier && (
            <p className="text-xs text-red-500">{errors.identifier.message}</p>
          )}
        </LabelInputContainer>

        {/* Password */}
        <LabelInputContainer className="mb-8">
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
          {isSubmitting ? "Signing in..." : "Sign In →"}
        </button>

        <p className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>

      </form>
    </div>
  );
}