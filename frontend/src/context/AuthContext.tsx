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

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: any) =>
{
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true)
  // LOGIN

  console.log('Login state', user)

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
      setLoading(false);       // ← always mark done
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
      value={{ user, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
