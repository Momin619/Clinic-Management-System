import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/axios";
import TabBar from "./TabBar";
import SettingsSection from "./SettingsSection";
import FormField from "./FormField";
import StatusMessage from "./StatusMessage";
import SubmitButton from "./SubmitButton";

type Tab = "profile" | "appearance";

const TABS: { label: string; value: Tab }[] = [
  { label: "Profile", value: "profile" },
  { label: "Appearance", value: "appearance" },
];

export default function Settings()
{
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Name form
  const [name, setName] = useState(user?.name ?? "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Theme
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  const handleThemeToggle = (value: "light" | "dark") =>
  {
    setTheme(value);
    document.documentElement.classList.toggle("dark", value === "dark");
    localStorage.setItem("theme", value);
  };

  const handleNameUpdate = async (e: React.FormEvent) =>
  {
    e.preventDefault();
    if (!name.trim()) return;
    setNameLoading(true);
    setNameMsg(null);
    try
    {
      await api.patch("/auth/me", { name });
      setNameMsg({ type: "success", text: "Name updated successfully." });
    } catch
    {
      setNameMsg({ type: "error", text: "Failed to update name. Please try again." });
    } finally
    {
      setNameLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) =>
  {
    e.preventDefault();
    setPassMsg(null);
    if (newPassword !== confirmPassword)
    {
      setPassMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 8)
    {
      setPassMsg({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }
    setPassLoading(true);
    try
    {
      await api.patch("/auth/me/password", { currentPassword, newPassword });
      setPassMsg({ type: "success", text: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch
    {
      setPassMsg({ type: "error", text: "Current password is incorrect." });
    } finally
    {
      setPassLoading(false);
    }
  };

  const handleLogout = async () =>
  {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
        * { font-family: "Geist", sans-serif; }
      `}</style>

      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-4 py-12">

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Settings</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage your account preferences.</p>
          </div>

          <div className="mb-8">
            <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
          </div>

          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && (
            <div className="space-y-6">

              <SettingsSection title="Display name" description="This is the name visible across your account.">
                <form onSubmit={handleNameUpdate} className="space-y-4">
                  <FormField
                    id="name"
                    label="Full name"
                    value={name}
                    onChange={setName}
                    placeholder="Your name"
                  />
                  <StatusMessage message={nameMsg} />
                  <div className="flex justify-end">
                    <SubmitButton loading={nameLoading} label="Save name" loadingLabel="Saving…" />
                  </div>
                </form>
              </SettingsSection>

              <SettingsSection title="Password" description="Choose a strong password of at least 8 characters.">
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <FormField id="cur-pass" label="Current password" type="password" value={currentPassword} onChange={setCurrentPassword} placeholder="••••••••" />
                  <FormField id="new-pass" label="New password" type="password" value={newPassword} onChange={setNewPassword} placeholder="••••••••" />
                  <FormField id="conf-pass" label="Confirm new password" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" />
                  <StatusMessage message={passMsg} />
                  <div className="flex justify-end">
                    <SubmitButton loading={passLoading} label="Update password" loadingLabel="Updating…" />
                  </div>
                </form>
              </SettingsSection>

              <SettingsSection title="Sign out" description="You will be redirected to the login page.">
                <SubmitButton
                  type="button"
                  loading={false}
                  label="Sign out"
                  loadingLabel="Signing out…"
                  variant="danger"
                  onClick={handleLogout}
                />
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
                      onClick={() => handleThemeToggle(t)}
                      className={`relative flex flex-col items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer text-left
                        ${theme === t
                          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                        }`}
                    >
                      <div className={`w-full h-16 rounded-lg border flex flex-col gap-1.5 p-2 overflow-hidden
                        ${t === "light" ? "bg-white border-zinc-100" : "bg-zinc-900 border-zinc-700"}`}
                      >
                        <div className={`h-1.5 rounded-full w-2/3 ${t === "light" ? "bg-zinc-200" : "bg-zinc-700"}`} />
                        <div className={`h-1.5 rounded-full w-1/2 ${t === "light" ? "bg-zinc-100" : "bg-zinc-800"}`} />
                        <div className={`mt-auto h-4 rounded-full w-1/3 ${t === "light" ? "bg-zinc-900" : "bg-white"}`} />
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 capitalize">{t}</span>
                        {theme === t && (
                          <span className="size-4 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center">
                            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                              <path d="M1 3l2 2 4-4" stroke={t === "dark" ? "#18181b" : "#fff"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
    </>
  );
}
