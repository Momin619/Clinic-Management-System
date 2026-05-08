import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { useThemeContext } from "../../context/ThemeContext";

import TabBar from "./TabBar";
import SettingsSection from "./SettingsSection";
import FormField from "./FormField";
import SubmitButton from "./SubmitButton";

import { updateNameApi, updatePasswordApi } from "./settings.api";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "profile" | "appearance";

interface NameFormValues
{
  name: string;
}

interface PasswordFormValues
{
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const TABS: { label: string; value: Tab }[] = [
  { label: "Profile", value: "profile" },
  { label: "Appearance", value: "appearance" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extracts a user-friendly message from an Axios error or a plain Error. */
function getErrorMessage(err: unknown, fallback: string): string
{
  if (err && typeof err === "object")
  {
    const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
    return axiosErr.response?.data?.message ?? axiosErr.message ?? fallback;
  }
  return fallback;
}

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function Settings()
{
  const { user, logout, setUser } = useAuth();
  const { theme, setTheme } = useThemeContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loggingOut, setLoggingOut] = useState(false);

  // ── Name form ──────────────────────────────────────────────────────────────
  const {
    handleSubmit: handleNameSubmit,
    formState: { errors: nameErrors, isSubmitting: nameSubmitting },
    register: registerName,
  } = useForm<NameFormValues>({
    defaultValues: { name: user?.name ?? "" },
  });

  const onSaveName = async (data: NameFormValues) =>
  {
    try
    {
      const result = await updateNameApi({ name: data.name });
      console.log(result)
      setUser?.(result.user);
      toast.success("Display name updated successfully.");
    } catch (err)
    {
      toast.error(getErrorMessage(err, "Failed to update name. Please try again."));
    }
  };

  // ── Password form ──────────────────────────────────────────────────────────
  const {
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
    register: registerPassword,
    watch: watchPassword,
    reset: resetPassword,
    getValues: getPasswordValues,
  } = useForm<PasswordFormValues>({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const watchedNewPassword = watchPassword("newPassword");

  const onUpdatePassword = async (data: PasswordFormValues) =>
  {
    try
    {
      await updatePasswordApi(data);
      toast.success("Password updated successfully.");
      resetPassword();
    } catch (err)
    {
      toast.error(getErrorMessage(err, "Failed to update password. Please try again."));
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () =>
  {
    setLoggingOut(true);
    try
    {
      await logout();
      navigate("/login");
    } catch
    {
      toast.error("Logout failed. Please try again.");
      setLoggingOut(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen transition-colors duration-300 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-2xl px-4 py-12 mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Settings</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your account preferences.
          </p>
        </div>

        {/* Tab bar */}
        <div className="mb-8">
          <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>

        {/* ── PROFILE TAB ── */}
        {activeTab === "profile" && (
          <div className="space-y-6">

            {/* Display name */}
            <SettingsSection
              title="Display name"
              description="This is the name visible across your account."
            >
              <form onSubmit={handleNameSubmit(onSaveName)} className="space-y-4" noValidate>
                <FormField
                  id="name"
                  label="Full name"
                  placeholder="Your name"
                  error={nameErrors.name?.message}
                  disabled={nameSubmitting}
                  {...registerName("name", {
                    required: "Name is required.",
                    minLength: { value: 2, message: "Name must be at least 2 characters." },
                    maxLength: { value: 50, message: "Name must be 50 characters or fewer." },
                    pattern: {
                      value: /^[a-zA-Z0-9 _-]+$/,
                      message: "Only letters, numbers, spaces, hyphens, and underscores allowed.",
                    },
                  })}
                />
                <div className="flex justify-center sm:justify-end">
                  <SubmitButton loading={nameSubmitting} label="Save name" loadingLabel="Saving…" />
                </div>
              </form>
            </SettingsSection>

            {/* Password */}
            <SettingsSection
              title="Password"
              description="Choose a strong password of at least 8 characters."
            >
              <form
                onSubmit={handlePasswordSubmit(onUpdatePassword)}
                className="space-y-4"
                noValidate
              >
                <FormField
                  id="cur-pass"
                  label="Current password"
                  type="password"
                  placeholder="••••••••"
                  error={passwordErrors.currentPassword?.message}
                  disabled={passwordSubmitting}
                  {...registerPassword("currentPassword", {
                    required: "Current password is required.",
                  })}
                />

                <FormField
                  id="new-pass"
                  label="New password"
                  type="password"
                  placeholder="••••••••"
                  error={passwordErrors.newPassword?.message}
                  disabled={passwordSubmitting}
                  {...registerPassword("newPassword", {
                    required: "New password is required.",
                    minLength: { value: 8, message: "Password must be at least 8 characters." },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message:
                        "Must include an uppercase letter, a lowercase letter, and a number.",
                    },
                    validate: (val) =>
                      val !== getPasswordValues("currentPassword") ||
                      "New password must differ from your current password.",
                  })}
                />

                <FormField
                  id="conf-pass"
                  label="Confirm new password"
                  type="password"
                  placeholder="••••••••"
                  error={passwordErrors.confirmPassword?.message}
                  disabled={passwordSubmitting}
                  {...registerPassword("confirmPassword", {
                    required: "Please confirm your new password.",
                    validate: (val) =>
                      val === watchedNewPassword || "Passwords do not match.",
                  })}
                />

                <div className="flex justify-center sm:justify-end">
                  <SubmitButton
                    loading={passwordSubmitting}
                    label="Update password"
                    loadingLabel="Updating…"
                  />
                </div>
              </form>
            </SettingsSection>

            {/* Sign out */}
            <SettingsSection
              title="Sign out"
              description="You will be redirected to the login page."
            >
              <div className="flex justify-center sm:justify-end">
                <SubmitButton
                  type="button"
                  loading={loggingOut}
                  label="Sign out"
                  loadingLabel="Signing out…"
                  variant="danger"
                  onClick={handleLogout}
                />
              </div>
            </SettingsSection>

          </div>
        )}

        {/* ── APPEARANCE TAB ── */}
        {activeTab === "appearance" && (
          <div className="space-y-6">
            <SettingsSection title="Theme" description="Choose how the interface looks for you.">
              <div className="grid grid-cols-2 gap-3">
                {(["light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`relative flex flex-col items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer text-left
                      ${theme === t
                        ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                      }`}
                  >
                    <div
                      className={`w-full h-16 rounded-lg border flex flex-col gap-1.5 p-2 overflow-hidden
                        ${t === "light" ? "bg-white border-zinc-100" : "bg-zinc-900 border-zinc-700"}`}
                    >
                      <div className={`h-1.5 rounded-full w-2/3 ${t === "light" ? "bg-zinc-200" : "bg-zinc-700"}`} />
                      <div className={`h-1.5 rounded-full w-1/2 ${t === "light" ? "bg-zinc-100" : "bg-zinc-800"}`} />
                      <div className={`mt-auto h-4 rounded-full w-1/3 ${t === "light" ? "bg-zinc-900" : "bg-white"}`} />
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium capitalize text-zinc-800 dark:text-zinc-200">
                        {t}
                      </span>
                      {theme === t && (
                        <span className="flex items-center justify-center rounded-full size-4 bg-zinc-900 dark:bg-white">
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path
                              d="M1 3l2 2 4-4"
                              stroke={t === "dark" ? "#18181b" : "#fff"}
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </SettingsSection>
          </div>
        )}

      </div>
    </div>
  );
}