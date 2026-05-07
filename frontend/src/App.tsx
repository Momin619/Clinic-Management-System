import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignupPage from "./pages/Auth/SignupPage";
import LoginPage from "./pages/Auth/LoginPage";
import SettingPage from "./pages/Setting/SettingPage";
import './styles/output.css'
import './styles/index.css'
import { Toaster } from "react-hot-toast";
import { setNavigator } from "./utils/navigation"
import Navbar from './components/ui/Navbar'
import { useAuth } from "./context/AuthContext";
export default function App()
{
  const { loading } = useAuth();
  const navigate = useNavigate();


  useEffect(() =>
  {
    setNavigator(navigate);
  }, [navigate]);

  if (loading)
  {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }


  return (
    <>


      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#16a34a",
              color: "white",
            },
          },
          error: {
            style: {
              background: "#dc2626",
              color: "white",
            },
          },
        }}
      />

      <Navbar />

      <Routes>
        {/* Default redirect */}
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        {/* Auth routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingPage />} />

      </Routes>
    </>
  );
}
