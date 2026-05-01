import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignupPage from "./pages/Auth/SignupPage";
import LoginPage from "./pages/Auth/LoginPage";
import './styles/output.css'
import './styles/index.css'
import { Toaster } from "react-hot-toast";
import { setNavigator } from "./utils/navigation"
export default function App()
{
  const navigate = useNavigate();

  useEffect(() =>
  {
    setNavigator(navigate);
  }, [navigate]);


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
      <Routes>
        {/* Default redirect */}
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        {/* Auth routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}
