# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Soul Bible is a React Native mobile app built with Expo that displays inspirational Bible verses with Material Design 3 theming. The app is cross-platform (iOS, Android, Web) and features light/dark mode with system theme synchronization.

**Note**: Authentication flows and backend integration were recently removed (commit e83ec1a). The app now focuses on Bible verse display with theme management.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Platform-specific development
npx expo start --ios        # Open in iOS simulator
npx expo start --android    # Open in Android emulator
npx expo start --web        # Open in web browser

# Linting
npm run lint
```

## Architecture

### Tech Stack
- **React Native** 0.81.5 with React 19.1.0
- **Expo** ~54.0.23 (SDK 54) with Expo Router for file-based navigation
- **React Native Paper** ^5.14.5 for Material Design 3 UI components
- **Zustand** ^5.0.8 for lightweight state management
- **TypeScript** in strict mode

### Key Architectural Patterns

**Service Layer**
- Services handle external API calls and business logic
- Located in `services/` directory
- Example: `bibleService.ts` fetches verses from bible-api.com
- Services export typed functions and interfaces
- Error handling with fallback values

**State Management (Zustand)**
- Stores located in `store/` directory
- Current store: `themeStore.ts` manages dark/light mode
- Store pattern: state + actions exported as custom hook
- Example: `useThemeStore()` provides `isDarkMode`, `setIsDarkMode()`, `toggleTheme()`

**Navigation (Expo Router)**
- File-based routing in `app/` directory
- `_layout.tsx` files define layout hierarchies
- Root layout (`app/_layout.tsx`) sets up app-wide theme provider
- Typed routes enabled via experiment flag

**Theming System**
- Material Design 3 with shadcn-inspired neutral palette
- Theme definitions in `constants/theme.ts` export `lightTheme` and `darkTheme`
- Comprehensive color system: primary, secondary, tertiary, error, surface variants, elevation levels
- System theme sync on app startup via `useSystemTheme()` hook
- Access theme in components via `usePaperTheme()` from React Native Paper

### Directory Structure

```
app/                    # Expo Router screens and layouts
  _layout.tsx          # Root layout with PaperProvider and theme setup
  index.tsx            # Home screen with Bible verse display
services/              # Business logic and API integration
  bibleService.ts     # Bible API service (bible-api.com)
store/                 # Zustand state management
  themeStore.ts       # Theme state (dark/light mode)
constants/             # App-wide constants
  theme.ts            # Material Design 3 theme definitions
assets/                # Images, icons, splash screens
```

### Bible Verse Service

The `bibleService.ts` provides `getRandomBibleVerse()` which:
- Fetches from a curated list of 20 inspirational verses
- Uses bible-api.com API (free, no authentication)
- Returns `{ text, reference, translation }` interface
- Includes fallback handling for API failures
- Cleans verse text (removes verse numbers, normalizes whitespace)

## Code Conventions

**Component Structure**
- Functional components with React Hooks
- Use `usePaperTheme()` for theme access
- Use `StyleSheet.create()` for styles
- SafeAreaView for proper layout on notched devices

**Styling Patterns**
- Static styles via StyleSheet.create()
- Dynamic styles with arrays: `[styles.static, { color: theme.colors.primary }]`
- Flex-based layouts
- Elevation property for Material Design depth

**File Naming**
- Routes: `index.tsx`, `[slug].tsx` (Expo Router convention)
- Services: `*Service.ts` (e.g., `bibleService.ts`)
- Stores: `*Store.ts` (e.g., `themeStore.ts`)
- Layouts: `_layout.tsx`

**Import Order**
1. React imports
2. Third-party libraries
3. Local imports (services, stores, constants, components)

**Type Safety**
- TypeScript strict mode enabled
- Type all function parameters and return values
- Use interfaces for complex types
- Leverage React Native Paper's built-in types

## Configuration

**Expo Experiments** (app.json)
- `typedRoutes: true` - Type-safe routing with Expo Router
- `reactCompiler: true` - React 19 compiler optimizations
- New Architecture enabled

**TypeScript**
- Path alias: `@/*` maps to repository root
- Extends expo/tsconfig.base
- Strict mode enforced

**Platform Support**
- iOS: Tablet support enabled
- Android: Adaptive icons, edge-to-edge layout
- Web: Static output mode
