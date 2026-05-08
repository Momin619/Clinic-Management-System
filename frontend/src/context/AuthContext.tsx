import
{
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { api } from "../api/axios";
import type
{
  LoginData,
  SignupData,
  User,
} from "../types/auth";

import type { Dispatch, SetStateAction } from 'react'
type AuthContextType = {
  user: User | null;
  authChecked: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  setUser: Dispatch<SetStateAction<User | null>>;
};
const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: any) =>
{
  const [user, setUser] = useState<User | null>(null);
  // LOGIN
  const [authChecked, setAuthChecked] = useState(false);


  const login = async (data: LoginData) =>
  {
    const res = await api.post("/auth/login", data);
    console.log(res.data)
    setUser(res.data.result.user);

  };

  // SIGNUP (no state update)
  const signup = async (data: SignupData) =>
  {
    await api.post("/auth/signup", data);
  };

  // LOGOUT
  const logout = async () =>
  {
    await api.post("/auth/logout");
    setUser(null);
  };

  // restore session
  const fetchMe = async () =>
  {
    try
    {
      const res = await api.get("/auth/me");
      setUser(res.data.result.user);
    } catch
    {
      setUser(null);
    } finally
    {
      setAuthChecked(true);
    }
  };
  // AuthContext.tsx
  useEffect(() =>
  {
    (async () =>
    {
      await fetchMe();
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, authChecked, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
