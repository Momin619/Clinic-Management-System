import { createContext, useContext } from "react";
import useTheme from "../hooks/useTheme";

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType>(null!);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) =>
{
  const value = useTheme();

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);