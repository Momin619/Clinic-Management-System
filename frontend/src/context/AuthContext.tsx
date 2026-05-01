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
  user: User;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: any) =>
{
  const [user, setUser] = useState<User>(null);

  // LOGIN
  const login = async (data: LoginData) =>
  {
    const res = await api.post("/auth/login", data);
    setUser(res.data);
  };

  // SIGNUP (no state update)
  const signup = async (data: SignupData) =>
  {
    await api.post("/auth/signup", data);
  };

  // LOGOUT
  const logout = () =>
  {
    setUser(null);
  };

  // restore session
  const fetchMe = async () =>
  {
    try
    {
      const res = await api.get("/auth/me");
      console.log(res)
      setUser(res.data);
    } catch
    {
      setUser(null);
    }
  };

  useEffect(() =>
  {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
