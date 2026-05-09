import
{
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { api } from "../api/axios";
import type {
  LoginData,
  SignupData,
  User,
} from "../types/auth";

import type { Dispatch, SetStateAction } from "react";

type AuthContextType = {
  user: User | null;
  /** true once the initial session-restore attempt has settled */
  authChecked: boolean;
  /** Convenience alias — use wherever you want `if (loading) return <Loader />` */
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  setUser: Dispatch<SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) =>
{
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // ─── Login ──────────────────────────────────────────────────────────────────
  const login = async (data: LoginData) =>
  {
    const res = await api.post("/auth/login", data);
    setUser(res.data.result.user);
  };

  // ─── Signup (no state update — user must log in after) ──────────────────────
  const signup = async (data: SignupData) =>
  {
    await api.post("/auth/signup", data);
  };

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = async () =>
  {
    try
    {
      await api.post("/auth/logout");
    } finally
    {
      // Always clear local state even if the request fails
      setUser(null);
    }
  };

  // ─── Restore session on mount ────────────────────────────────────────────────
  // The axios interceptor will silently refresh an expired access token before
  // this promise resolves, so the catch branch only runs when BOTH tokens are
  // gone (true "not logged in" state).
  const fetchMe = async () =>
  {
    try
    {
      const res = await api.get("/auth/me");
      setUser(res.data.result.user);
    } catch (err)
    {
      console.log(err);

    } finally
    {
      setAuthChecked(true);
    }
  };

  useEffect(() =>
  {
    (async () =>
    {
      await fetchMe();
    })();
  }, []);


  // ─── Listen for interceptor signalling that the session has truly expired ────
  // When the refresh token is also invalid the axios interceptor dispatches
  // "auth:session-expired" so we can wipe the React state without a circular
  // import between axios.ts and AuthContext.tsx.
  useEffect(() =>
  {
    const handleSessionExpired = () =>
    {
      setUser(null);
      setAuthChecked(true); // unblock ProtectedRoutes so it can redirect
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () =>
    {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authChecked,
        loading: !authChecked, // FIX: expose `loading` so App.tsx works correctly
        login,
        signup,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);