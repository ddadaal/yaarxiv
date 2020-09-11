import { useDarkMode } from "next-dark-mode";
import { useCallback } from "react";

export type Theme = "dark" | "light";

export function ThemeStore() {

  const {
    autoModeActive,
    darkModeActive,
    autoModeSupported,
    switchToAutoMode,
    switchToDarkMode,
    switchToLightMode,
  } = useDarkMode();

  const theme: Theme = darkModeActive ? "dark": "light";

  const changeTheme = useCallback((to: Theme) => {
    switch (to) {
    case "dark":
      switchToDarkMode();
      return;
    case "light":
      switchToLightMode();
      return;
    }
  }, []);

  return {
    theme,
    changeTheme,
    autoModeSupported,
    autoModeActive,
    switchToAutoMode,
  };
}
