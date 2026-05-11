import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignupPage from "./pages/Auth/SignupPage";
import LoginPage from "./pages/Auth/LoginPage";
import SettingPage from "./pages/Setting/SettingPage";
import AddAppointmentPage from "./pages/Appointment/AddAppointmentPage";
import AppointmentPage from "./pages/Appointment/ScheduledAppointmentPage";
import CompletedAppointmentsPage from "./pages/Appointment/CompletedAppointmentsPage";
import "./styles/output.css";
import "./styles/index.css";
import { Toaster } from "react-hot-toast";
import { setNavigator } from "./utils/navigation";
import Navbar from "./components/ui/Navbar";
import { useAuth } from "./context/AuthContext";
import Loader from "./components/ui/Loader";
import ProtectedRoutes from "./components/Auth/ProtectedRoutes";
import NotFound from "./components/ui/NotFound";

export default function App()
{
  // FIX: was `loading` (undefined) — now correctly reads the `loading` alias
  // exported from AuthContext (which equals `!authChecked`).
  const { loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() =>
  {
    setNavigator(navigate);
  }, [navigate]);

  // Show a full-page spinner until we know whether the user is logged in.
  // Without this guard, the Navbar and protected routes briefly render in an
  // unauthenticated state before fetchMe resolves, causing a flash to /login.
  if (loading)
  {
    return <Loader />;
  }

  return (
    <>
      <Toaster
        position="top-center"
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
        {/* Public routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/settings" element={<SettingPage />} />
          {/* add more protected routes here */}
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/add-appointment" element={<AddAppointmentPage />} />
          {/* add more protected routes here */}
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/scheduled-appointments" element={<AppointmentPage />} />
          {/* add more protected routes here */}
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/completed-appointments" element={<CompletedAppointmentsPage />} />
          {/* add more protected routes here */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}