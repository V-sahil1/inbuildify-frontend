import { createContext, useEffect, useState } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode?: (isDarkMode: boolean) => void;
  toggleTheme: () => void;
}
export const themeContext = createContext<ThemeContextType | null>(null);

export const ThemeContextProvider = ({ children }) => {

  const [isDarkMode, setIsDarkMode] = useState<boolean>(null);
  useEffect(() => {
    setIsDarkMode(localStorage.getItem('theme') === 'True' ? true : false)
  }, [localStorage])

  const toggleTheme = () => {
    const currentTheme = localStorage.getItem("theme");
    const newTheme = currentTheme === "True" ? "False" : "True";
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(newTheme === "True");
  };

  document.documentElement.setAttribute(
    "data-theme",
    isDarkMode ? "dark" : "light"
  );

  return (
    <themeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </themeContext.Provider>
  )
}