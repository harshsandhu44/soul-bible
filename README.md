# Soul Bible

A comprehensive Bible reading app built with React Native and Expo, featuring Material Design 3 theming, bookmarks, reading history, and multiple Bible translations.

## Features

- 📖 **Bible Reading** - Browse all books of the Bible and read chapters with clean, readable typography
- 🔖 **Bookmarks** - Save favorite chapters for quick access with timestamps and metadata
- 📚 **Reading History** - Track your reading progress with read/unread status indicators
- 📝 **Daily Inspiration** - Random inspirational Bible verses on the home screen
- 🌍 **Multiple Translations** - Support for various Bible translations (KJV, ASV, WEB, and more)
- 🎨 **Material Design 3** - Beautiful, modern UI with shadcn-inspired neutral palette
- 🌗 **Theme Support** - Light and dark mode with automatic system theme synchronization
- 📱 **Cross-Platform** - Runs seamlessly on iOS, Android, and Web
- ⚡ **Modern Stack** - Built with Expo Router, React Native Paper, Zustand, and TypeScript

## Get Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npx expo start
```

In the output, you'll find options to open the app in:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) (recommended for quick testing)

### 3. Platform-Specific Development

```bash
# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Web Browser
npx expo start --web
```

## Project Structure

```
soul-bible/
├── app/                           # Expo Router screens and layouts
│   ├── _layout.tsx               # Root layout with theme provider
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── _layout.tsx          # Tab navigator configuration
│   │   ├── index.tsx            # Home screen (daily verse)
│   │   ├── bible/               # Bible reading stack
│   │   │   ├── _layout.tsx     # Stack navigator
│   │   │   ├── index.tsx       # Books selection grid
│   │   │   └── [book]/
│   │   │       ├── index.tsx   # Chapter selection grid
│   │   │       └── [chapter].tsx # Chapter reader with FAB
│   │   └── bookmarks/           # Bookmarks stack
│   │       ├── _layout.tsx     # Stack navigator
│   │       └── index.tsx       # Bookmarks list
│   └── onboarding/              # First-time user flow
│       ├── _layout.tsx
│       ├── welcome.tsx
│       └── translation.tsx
├── components/                   # Reusable UI components
│   ├── ChapterCard.tsx          # Grid item for chapter selection
│   └── BookmarkListItem.tsx     # List item for bookmarks
├── services/                     # Business logic and API integration
│   └── bibleService.ts          # Bible API service (bible-api.com)
├── store/                        # Zustand state management
│   ├── themeStore.ts            # Theme preferences (light/dark)
│   ├── userPreferencesStore.ts  # User settings (translation, onboarding)
│   └── bibleReadingStore.ts     # Bookmarks, history, last position
├── constants/
│   └── theme.ts                 # Material Design 3 theme definitions
└── assets/                       # Images, icons, splash screens
```

## Tech Stack

### Core
- **React Native** 0.81.5 with React 19.1.0 - Cross-platform mobile framework
- **Expo** ~54.0.23 (SDK 54) - Development platform and tooling
- **TypeScript** - Type safety and better developer experience

### UI & Navigation
- **Expo Router** - File-based navigation with type safety
- **React Native Paper** ^5.14.5 - Material Design 3 components
- **Material Design 3** - Shadcn-inspired neutral color palette

### State Management & Storage
- **Zustand** ^5.0.8 - Lightweight state management
- **AsyncStorage** - Local data persistence for bookmarks and preferences

### External APIs
- **bible-api.com** - Bible verse fetching (free, no authentication required)

## Architecture & Design Patterns

### Navigation Structure
The app uses a **Tabs + Nested Stacks** pattern:
- Root layout manages theme and onboarding redirect
- Bottom tabs provide primary navigation (Home, Read Bible, Bookmarks)
- Stack navigators within tabs handle hierarchical navigation
- Proper back button support across all navigation flows

### State Management (Zustand)
Three stores manage different aspects of the app:

1. **themeStore.ts** - Theme preferences
   - Dark/light mode toggle
   - System theme synchronization
   - Persisted to AsyncStorage

2. **userPreferencesStore.ts** - User settings
   - Preferred Bible translation
   - Onboarding completion status
   - Persisted to AsyncStorage

3. **bibleReadingStore.ts** - Reading data
   - Bookmarks with timestamps and metadata
   - Reading history (books/chapters read)
   - Last reading position
   - Persisted to AsyncStorage

### Service Layer
Business logic abstracted in `services/bibleService.ts`:
- Bible verse fetching from external API
- Book and chapter metadata
- Text cleaning and formatting
- Error handling with fallback values

### Component Architecture
- **Functional components** with React Hooks
- **StyleSheet.create()** for optimized styles
- **Theme-aware components** using `usePaperTheme()`
- **Custom components** for grid items and list items (ChapterCard, BookmarkListItem)

## Key Features

### Bible Reading System
- **66 Books** - Complete Old and New Testament
- **Chapter Reader** - Clean, readable interface with verse numbers
- **Navigation** - Previous/Next chapter buttons with chapter counter
- **Translation Support** - KJV, ASV, WEB, and more via bible-api.com

### Bookmarks
- **Save Chapters** - Tap the FAB (Floating Action Button) in the chapter reader
- **Timestamp Tracking** - See when you bookmarked each chapter
- **Read Status** - Visual indicator showing read/unread chapters
- **Quick Access** - Dedicated bookmarks tab with sorted list (newest first)
- **Metadata** - Optional verse and note fields (for future expansion)

### Reading History
- **Progress Tracking** - Automatic tracking of read chapters
- **Visual Indicators** - Different card colors for read vs unread chapters
- **Last Position** - "Continue Reading" feature on home screen
- **Persistence** - All data stored locally with AsyncStorage

### Theming
- **Material Design 3** - Shadcn-inspired neutral palette
- **Light Mode** - Clean whites and near-blacks
- **Dark Mode** - Deep grays with proper contrast
- **System Sync** - Automatically matches device theme preference
- **Comprehensive Colors** - Primary, secondary, tertiary, error, surface variants, elevation levels

## Development Guide

### Code Conventions

**File Naming:**
- Routes: `index.tsx`, `[slug].tsx` (Expo Router convention)
- Services: `*Service.ts` (e.g., `bibleService.ts`)
- Stores: `*Store.ts` (e.g., `themeStore.ts`)
- Components: PascalCase `.tsx` (e.g., `ChapterCard.tsx`)
- Layouts: `_layout.tsx`

**Import Order:**
1. React imports
2. Third-party libraries
3. Local imports (services, stores, constants, components)

**Styling Patterns:**
- Static styles via `StyleSheet.create()`
- Dynamic styles with arrays: `[styles.static, { color: theme.colors.primary }]`
- Flex-based layouts
- Elevation property for Material Design depth

### State Management Usage

```typescript
// Theme Store
const { isDarkMode, toggleTheme, setIsDarkMode } = useThemeStore();

// User Preferences Store
const { preferredTranslation, setPreferredTranslation, hasCompletedOnboarding } = useUserPreferencesStore();

// Bible Reading Store
const { bookmarks, addBookmark, removeBookmark, isChapterBookmarked, hasReadChapter } = useBibleReadingStore();
```

### Adding New Features

1. **Create service layer** - Add business logic in `services/`
2. **Update store** - Add state management in appropriate Zustand store
3. **Build UI components** - Create reusable components in `components/`
4. **Add screens** - Create routes in `app/` directory
5. **Update navigation** - Modify layouts for new routes
6. **Test thoroughly** - Verify on iOS, Android, and Web

## Platform Support

- **iOS** - Tablet support enabled, native gestures, proper SafeAreaView handling
- **Android** - Adaptive icons, edge-to-edge layout, Material Design ripple effects
- **Web** - Static output mode, responsive design, keyboard navigation

## Configuration

### Expo Experiments (app.json)
- `typedRoutes: true` - Type-safe routing with Expo Router
- `reactCompiler: true` - React 19 compiler optimizations
- New Architecture enabled for better performance

### TypeScript
- Path alias: `@/*` maps to repository root
- Extends `expo/tsconfig.base`
- Strict mode enforced

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Paper](https://reactnativepaper.com/)
- [Material Design 3](https://m3.material.io/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Bible API Documentation](https://bible-api.com/)

## License

This project is for personal use and educational purposes.
