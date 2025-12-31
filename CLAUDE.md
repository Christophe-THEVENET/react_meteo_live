# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Production build
npm run lint         # ESLint
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
```

## Architecture

### Provider Stack (main.jsx)
```
Provider (Redux)
  └── PersistGate (Redux Persist - waits for rehydration)
        └── QueryClientProvider (React Query)
              └── App
```

### State Management

**Redux slices** (`src/redux/`):
- `citySlice`: stores selected city (`state.city.value`)
- `langSlice`: stores language FR/EN (`state.lang.value`)
- Both persisted to localStorage via Redux Persist (key: `meteo-easy`)

### Custom Hooks (`src/hooks/useWeather.js`)

| Hook | API | Trigger |
|------|-----|---------|
| `useWeather(city, lang)` | OpenWeatherMap | city + lang exist |
| `useTimeZone(lat, lon)` | TimeZoneDB | coordinates from useWeather |
| `useCitySearch(query)` | GeoNames | query.length >= 2 |
| `useGeolocation()` | Navigator + GeoNames | first visit (no city) |

Hooks are chained: `useWeather` provides coordinates → `useTimeZone` uses them.

### API Keys

Create `src/API_KEYS.js` (gitignored):
```javascript
export const OpenWeather_API_KEY = 'xxx'
export const TimeZoneDB_API_KEY = 'xxx'
```

## Testing

Tests use `renderWithProviders()` from `src/tests/testUtils.jsx` which wraps components with Redux and React Query providers.

Run single test file:
```bash
npm test -- --testPathPatterns=Header.test.jsx
```

Mock API hooks in tests:
```javascript
jest.mock('../hooks/useWeather', () => ({
    useCitySearch: () => ({ data: [] })
}))
```
