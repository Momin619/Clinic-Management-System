import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import type { LoginData } from "../../types/auth";
import { toast } from "react-hot-toast";

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
    } catch (err: any)
    {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 rounded-2xl bg-white/80 dark:bg-zinc-900/80 
backdrop-blur-xl shadow-xl border border-gray-200 dark:border-zinc-800"

      >
        <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">
          Login
        </h1>

        {/* EMAIL OR NAME */}
        <input
          placeholder="Email or Name"
          {...register("identifier", {
            required: "Email or Name is required",
          })}
          className="w-full p-3 mb-2 rounded-lg bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 
text-black dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition"

        />
        {errors.identifier && (
          <p className="text-red-500 text-sm mb-2">
            {errors.identifier.message}
          </p>
        )}

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="w-full p-3 mb-2 rounded-lg bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 
text-black dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition"

        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">
            {errors.password.message}
          </p>
        )}

        <button
          disabled={isSubmitting}
          className="w-full mt-5 bg-green-600 hover:bg-green-700 active:scale-[0.98] transition-all duration-200 text-white p-2.5 rounded-lg font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
}
