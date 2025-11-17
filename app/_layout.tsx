import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useColorScheme } from "react-native";
import { useState, useEffect, createContext, useContext } from "react";
import { lightTheme, darkTheme } from "../constants/theme";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");

  useEffect(() => {
    setIsDarkMode(systemColorScheme === "dark");
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: theme.colors.onPrimary,
            contentStyle: {
              backgroundColor: theme.colors.background,
            },
          }}
        />
      </PaperProvider>
    </ThemeContext.Provider>
  );
}
