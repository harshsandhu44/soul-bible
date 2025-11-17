import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

// Shadcn-inspired Material Design 3 color palette
// Neutral grayscale theme with clean aesthetics
const lightColors = {
  // Primary - Almost black for clean, modern look
  primary: "rgb(23, 23, 23)", // hsl(0 0% 9%)
  onPrimary: "rgb(250, 250, 250)", // hsl(0 0% 98%)
  primaryContainer: "rgb(245, 245, 245)", // hsl(0 0% 96.1%)
  onPrimaryContainer: "rgb(10, 10, 10)", // hsl(0 0% 3.9%)

  // Secondary - Light gray tones
  secondary: "rgb(245, 245, 245)", // hsl(0 0% 96.1%)
  onSecondary: "rgb(23, 23, 23)", // hsl(0 0% 9%)
  secondaryContainer: "rgb(229, 229, 229)", // hsl(0 0% 89.8%)
  onSecondaryContainer: "rgb(10, 10, 10)", // hsl(0 0% 3.9%)

  // Tertiary - Accent gray
  tertiary: "rgb(245, 245, 245)", // hsl(0 0% 96.1%)
  onTertiary: "rgb(23, 23, 23)", // hsl(0 0% 9%)
  tertiaryContainer: "rgb(229, 229, 229)", // hsl(0 0% 89.8%)
  onTertiaryContainer: "rgb(10, 10, 10)", // hsl(0 0% 3.9%)

  // Error - Red destructive actions
  error: "rgb(239, 68, 68)", // hsl(0 84.2% 60.2%)
  onError: "rgb(250, 250, 250)", // hsl(0 0% 98%)
  errorContainer: "rgb(254, 226, 226)", // lighter red
  onErrorContainer: "rgb(127, 29, 29)", // darker red

  // Background & Surface - Pure white
  background: "rgb(255, 255, 255)", // hsl(0 0% 100%)
  onBackground: "rgb(10, 10, 10)", // hsl(0 0% 3.9%)
  surface: "rgb(255, 255, 255)", // hsl(0 0% 100%)
  onSurface: "rgb(10, 10, 10)", // hsl(0 0% 3.9%)

  // Surface Variant - Muted
  surfaceVariant: "rgb(245, 245, 245)", // hsl(0 0% 96.1%)
  onSurfaceVariant: "rgb(115, 115, 115)", // hsl(0 0% 45.1%)

  // Outline - Border colors
  outline: "rgb(229, 229, 229)", // hsl(0 0% 89.8%)
  outlineVariant: "rgb(212, 212, 212)", // lighter border
  shadow: "rgb(0, 0, 0)",
  scrim: "rgb(0, 0, 0)",

  // Inverse colors
  inverseSurface: "rgb(10, 10, 10)", // hsl(0 0% 3.9%)
  inverseOnSurface: "rgb(250, 250, 250)", // hsl(0 0% 98%)
  inversePrimary: "rgb(250, 250, 250)", // hsl(0 0% 98%)

  // Elevation levels
  elevation: {
    level0: "transparent",
    level1: "rgb(252, 252, 252)",
    level2: "rgb(249, 249, 249)",
    level3: "rgb(247, 247, 247)",
    level4: "rgb(246, 246, 246)",
    level5: "rgb(245, 245, 245)",
  },

  surfaceDisabled: "rgba(10, 10, 10, 0.12)",
  onSurfaceDisabled: "rgba(10, 10, 10, 0.38)",
  backdrop: "rgba(10, 10, 10, 0.4)",
};

const darkColors = {
  // Primary - Almost white for dark mode
  primary: "rgb(250, 250, 250)", // hsl(0 0% 98%)
  onPrimary: "rgb(23, 23, 23)", // hsl(0 0% 9%)
  primaryContainer: "rgb(38, 38, 38)", // hsl(0 0% 14.9%)
  onPrimaryContainer: "rgb(250, 250, 250)", // hsl(0 0% 98%)

  // Secondary - Dark gray tones
  secondary: "rgb(38, 38, 38)", // hsl(0 0% 14.9%)
  onSecondary: "rgb(250, 250, 250)", // hsl(0 0% 98%)
  secondaryContainer: "rgb(51, 51, 51)", // slightly lighter
  onSecondaryContainer: "rgb(250, 250, 250)", // hsl(0 0% 98%)

  // Tertiary - Accent dark gray
  tertiary: "rgb(38, 38, 38)", // hsl(0 0% 14.9%)
  onTertiary: "rgb(250, 250, 250)", // hsl(0 0% 98%)
  tertiaryContainer: "rgb(51, 51, 51)", // slightly lighter
  onTertiaryContainer: "rgb(250, 250, 250)", // hsl(0 0% 98%)

  // Error - Dark red for destructive actions
  error: "rgb(239, 68, 68)", // keeping light red for visibility
  onError: "rgb(250, 250, 250)", // hsl(0 0% 98%)
  errorContainer: "rgb(109, 47, 47)", // hsl(0 62.8% 30.6%)
  onErrorContainer: "rgb(254, 226, 226)", // light red

  // Background & Surface - Very dark gray
  background: "rgb(10, 10, 10)", // hsl(0 0% 3.9%)
  onBackground: "rgb(250, 250, 250)", // hsl(0 0% 98%)
  surface: "rgb(10, 10, 10)", // hsl(0 0% 3.9%)
  onSurface: "rgb(250, 250, 250)", // hsl(0 0% 98%)

  // Surface Variant - Muted dark
  surfaceVariant: "rgb(38, 38, 38)", // hsl(0 0% 14.9%)
  onSurfaceVariant: "rgb(163, 163, 163)", // hsl(0 0% 63.9%)

  // Outline - Border colors for dark mode
  outline: "rgb(38, 38, 38)", // hsl(0 0% 14.9%)
  outlineVariant: "rgb(51, 51, 51)", // slightly lighter border
  shadow: "rgb(0, 0, 0)",
  scrim: "rgb(0, 0, 0)",

  // Inverse colors
  inverseSurface: "rgb(250, 250, 250)", // hsl(0 0% 98%)
  inverseOnSurface: "rgb(23, 23, 23)", // hsl(0 0% 9%)
  inversePrimary: "rgb(23, 23, 23)", // hsl(0 0% 9%)

  // Elevation levels - subtle variations for depth
  elevation: {
    level0: "transparent",
    level1: "rgb(18, 18, 18)",
    level2: "rgb(23, 23, 23)",
    level3: "rgb(28, 28, 28)",
    level4: "rgb(30, 30, 30)",
    level5: "rgb(33, 33, 33)",
  },

  surfaceDisabled: "rgba(250, 250, 250, 0.12)",
  onSurfaceDisabled: "rgba(250, 250, 250, 0.38)",
  backdrop: "rgba(10, 10, 10, 0.4)",
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: lightColors,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: darkColors,
};
