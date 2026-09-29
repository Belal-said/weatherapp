<div align="center">

# ☀️ Weather Now

**Current conditions, 7-day forecasts, and hour-by-hour temperatures for any city in the world.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?logo=axios&logoColor=white)
![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-FF8C00)
![No API key](https://img.shields.io/badge/API%20key-not%20required-success)

</div>

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Usage](#usage)
- [Architecture](#architecture)
- [API integration](#api-integration)
- [Data model](#data-model)
- [Reference](#reference)
- [Known limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

---

## Overview

Weather Now is a single-page React application. It turns a city name into a clear weather dashboard: what it's like right now, what the week looks like, and how the temperature changes hour by hour on any day of the week.

All data comes from the free [Open-Meteo](https://open-meteo.com/) APIs, so the project runs with no accounts, API keys or environment variables.

## Features

| | Feature | Description |
|---|---|---|
| 🔍 | **Place search** | Suggestions appear as you type, with region and country, so cities that share a name ("Paris, France" or "Paris, Texas") are easy to tell apart. Works with the mouse or the keyboard. |
| 🌡️ | **Current conditions** | City, country, local date, weather icon and current temperature. |
| 📊 | **Weather details** | Feels-like temperature, humidity, wind speed and precipitation. |
| 📅 | **7-day forecast** | Daily high and low temperatures with a condition icon for each day. |
| 🕐 | **Hourly forecast** | 24 hourly temperatures with day/night icons, for any of the next 7 days. |
| ⚙️ | **Units** | Switch between metric and imperial in one click, or set temperature, wind speed and precipitation units individually. |
| 🌍 | **Local time** | Every time shown is in the searched city's own timezone. |
| ⚡ | **Caching** | Forecasts and place searches are cached in `localStorage`, so repeat lookups load instantly, even after a page reload. |
| ♿ | **Keyboard friendly** | Every control works with the keyboard. Focus shows the design's ring (white, or blue on the Search button) using `:focus-visible`, so it appears for keyboard users but not on mouse clicks. |
| 💬 | **UI states** | Loading skeleton, "Search in progress", "No search result found!", and an API error page with a working **Retry** button, all matching the design. |

## Tech stack

| Layer | Technology |
|---|---|
| UI | [React 19](https://react.dev/) with hooks |
| Build tool | [Vite 8](https://vite.dev/) |
| HTTP client | [Axios](https://axios-http.com/) |
| Design | [Frontend Mentor](https://www.frontendmentor.io/) weather app challenge: DM Sans and Bricolage Grotesque fonts, SVG UI icons and illustrated weather icons |
| Linting | [ESLint](https://eslint.org/) with the React Hooks and React Refresh plugins |
| Data | [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) and [Forecast](https://open-meteo.com/en/docs) APIs |

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer
- npm (bundled with Node.js)

### Installation

```bash
git clone https://github.com/Belal-said/weatherapp.git
cd weatherapp
npm install
npm run dev
```

The app runs at <http://localhost:5173>.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot module replacement |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Check the codebase with ESLint |

## Usage

1. Type a city name, for example `Cairo`, `London` or `Paris`, in the search bar. Up to 5 matching places appear below it.
2. Click a place, or use **↑**/**↓** and press **Enter**. Pressing **Enter** or clicking **Search** without choosing picks the first (best) match. **Esc** closes the list.
3. Read the current conditions, the detail cards and the 7-day forecast.
4. Use the **Hourly Forecast** dropdown to view the 24-hour temperatures for any day of the week.
5. Open **Units** in the top bar to switch between metric and imperial, or to change a single unit. The current city reloads in the new units, and the selected day stays the same.

---

## Architecture

### Project structure

```
src/
├── api/
│   └── weather.js            # Open-Meteo requests and response mapping
├── hooks/
│   ├── useWeather.js         # Application state and weather loading
│   ├── usePlaceSearch.js     # Search-as-you-type place suggestions
│   └── useDismiss.js         # Closes menus on outside click or Escape
├── utils/
│   ├── weatherIcon.js        # WMO weather code → icon and label
│   ├── formatDate.js         # Date and time formatting helpers
│   ├── units.js              # Unit systems, menu options and labels
│   └── storage.js            # localStorage cache with expiry
├── components/
│   ├── Container.jsx         # Layout wrapper
│   ├── Navbar.jsx            # Branding and units control
│   ├── SearchBar.jsx         # Search box and suggestions list
│   ├── DayData.jsx           # Current conditions hero card
│   ├── ErrorState.jsx        # API error page with Retry
│   ├── Breakdown.jsx         # Weather detail cards
│   ├── WeekDays.jsx          # 7-day forecast
│   ├── HourlyForecast.jsx    # Hourly temperatures for the selected day
│   └── DaySelect.jsx         # Day dropdown in the Hourly Forecast header
├── assets/
│   ├── fonts/                # DM Sans and Bricolage Grotesque (with their OFL licenses)
│   └── images/               # Logo, UI icons, weather icons, hero backgrounds
├── App.jsx                   # Root component and page layout
├── main.jsx                  # Application entry point
└── index.css                 # Global styles
```

### Design principles

Each part of the code has one responsibility:

| Layer | Responsibility | Depends on React? |
|---|---|---|
| `api/` | Network requests and reshaping the data | No |
| `utils/` | Pure helper functions | No |
| `hooks/` | State and the actions that change it | Yes |
| `components/` | Rendering data received as props | Yes |

This keeps components simple, and it means the data layer can be tested or reused on its own.

### Data flow

```
 typing ──▶ usePlaceSearch ──searchPlaces(text)──▶ Geocoding API
                  │
                  ▼  up to 5 places
 ┌─────────────┐   onSearch(place)   ┌──────────────┐   fetchWeather(place)   ┌──────────────┐
 │  SearchBar  │ ──────────────────▶ │  useWeather  │ ──────────────────────▶ │ Forecast API │
 └─────────────┘                     └──────┬───────┘                         └──────────────┘
                                            │ { name, country, current, daily, hourly }
                                            ▼
                 ┌───────────┬───────────┬────────────┬──────────────────┐
                 │  DayData  │ Breakdown │  WeekDays  │  HourlyForecast  │
                 └───────────┴───────────┴────────────┴──────────────────┘
```

1. As the user types, `usePlaceSearch` waits 300 ms after the last keystroke, then asks the geocoding API for up to 5 matching places.
2. The user picks one, and `SearchBar` passes that place, with its coordinates, to `useWeather().search`.
3. `fetchWeather` requests the forecast for those coordinates and turns the response into arrays of objects that are easy to render.
4. `useWeather` stores the result and sets the selected day to today.
5. `App` passes each slice of the data to the component that displays it.

### Place suggestions

`usePlaceSearch(query)` powers the suggestions list:

- It only searches once the text is at least 2 characters long.
- It waits 300 ms after the last keystroke (debouncing), so typing "Alexandria" makes one request instead of ten.
- When the text changes, it cancels the previous request with an `AbortController`.
- It only returns results for the current text, so a slow response for older text is never shown.
- `searchNow()` searches immediately. The Search button and Enter use it when they are pressed before the suggestions arrive.

### State

All shared state lives in the `useWeather` hook:

| State | Type | Purpose |
|---|---|---|
| `weather` | `object \| null` | The latest forecast. `null` until the first successful search. |
| `selectedDay` | `string` | The date shown in the hourly forecast, e.g. `"2026-09-29"`. |
| `units` | `object` | Current units, e.g. `{ temperature: "celsius", wind: "kmh", precipitation: "mm" }`. |
| `loading` | `false \| "new" \| "refresh"` | `"new"` while loading a different place (shows the skeleton), `"refresh"` while reloading the same place, e.g. after a unit change (keeps the data on screen). |
| `notFound` | `boolean` | `true` after a search with no matching place. |
| `error` | `null \| { retry }` | Set when a request fails; `retry()` repeats exactly the request that failed. |
| `lastPlace` | `object \| null` | The last place loaded, with its coordinates, used to reload when the units change. |

The search text, the suggestions and the highlighted suggestion are local state inside `SearchBar`, so typing re-renders only the search bar.

Each weather request gets an increasing id. When a response arrives, it is applied only if it belongs to the latest request, so a slow, older response can't overwrite newer results.

The hourly forecast is derived from state rather than stored separately. It is recalculated on each render:

```js
const dayHours = hourly.filter((hour) => hour.time.startsWith(selectedDay));
```

### UI states

`App` decides what to show below the header:

| State | Shown when | What appears |
|---|---|---|
| API error | `error` is set | `ErrorState` replaces the heading, search and weather; **Retry** calls `error.retry()` |
| No results | `notFound` | "No search result found!" under the search bar |
| Loading | `loading === "new"` | The weather components with no data, which render as skeletons (`Loading…`, `–`, empty cards) |
| Weather | data loaded | The full dashboard |

Failures are still logged to the browser console with the full error, so the real cause can be debugged.

### Changing units

`changeUnits(next)` saves the new units and, if a place is loaded, runs `search(lastPlace, next, true)`. Because `lastPlace` already has the coordinates, only the forecast is requested again; there is no new city lookup. The last argument keeps the selected day instead of resetting it to today. Open-Meteo converts the values on its side, so the app does no conversion math.

### Caching

`api/weather.js` checks a `localStorage` cache (`utils/storage.js`) before making a request, and saves every response it receives:

| Data | Cache key | Kept for |
|---|---|---|
| Place suggestions | `weather-app:places:{text}` | 7 days, since names and coordinates rarely change |
| Forecast | `weather-app:weather:{lat},{lon}:{units}` | 15 minutes, so the weather stays fresh |

- Forecasts are cached per place **and** unit combination. Switching units back and forth, or loading the same place again, makes no requests while the entry is valid.
- Each entry stores its save and expiry times. An expired entry is deleted when it's read, and the forecast is requested again.
- The cache holds at most 30 entries (a forecast is about 10 KB). The oldest entries are removed first, and only this app's `weather-app:` keys are ever touched.
- If storage is full, the app clears its own cache and tries once more. If storage is blocked, for example in some private windows, the app keeps working without a cache.

To clear the cache manually, run this in the browser console:

```js
Object.keys(localStorage).filter((k) => k.startsWith("weather-app:")).forEach((k) => localStorage.removeItem(k));
```

---

## API integration

Both endpoints are free and need no authentication.

### 1. Geocoding

Turns the typed text into matching places. Called by `searchPlaces(query)`.

```http
GET https://geocoding-api.open-meteo.com/v1/search?name={query}&count=5&language=en&format=json
```

| Parameter | Value | Description |
|---|---|---|
| `name` | `encodeURIComponent(query)` | The typed text, made safe for use in a URL |
| `count` | `5` | Return up to 5 matches, best first |
| `language` | `en` | Return place names in English |

Each result is mapped to `{ id, name, region, country, latitude, longitude }`, where `region` is the API's `admin1` field, such as a state or province. If nothing matches, the response has no `results` field, and `searchPlaces` returns an empty array.

### 2. Forecast

Fetches the weather for those coordinates.

```http
GET https://api.open-meteo.com/v1/forecast
```

| Parameter | Value |
|---|---|
| `latitude`, `longitude` | From the geocoding result |
| `current` | `temperature_2m`, `apparent_temperature`, `relative_humidity_2m`, `wind_speed_10m`, `precipitation`, `is_day`, `weather_code` |
| `hourly` | `temperature_2m`, `weather_code`, `is_day` |
| `daily` | `weather_code`, `temperature_2m_max`, `temperature_2m_min` |
| `forecast_days` | `7`, which gives 168 hourly entries |
| `timezone` | `auto`, so all times are in the city's local time |
| `temperature_unit` | `celsius` or `fahrenheit` |
| `wind_speed_unit` | `kmh` or `mph` |
| `precipitation_unit` | `mm` or `inch` |

The default is metric: **°C**, **km/h** and **mm**. Temperatures and wind speed are rounded to whole numbers.

### Response mapping

Open-Meteo returns each section as a set of parallel arrays:

```json
{
  "hourly": {
    "time": ["2026-09-29T00:00", "2026-09-29T01:00"],
    "temperature_2m": [22.1, 21.6]
  }
}
```

`fetchWeather` combines them into one object per hour or day:

```js
[
  { time: "2026-09-29T00:00", temp: 22.1 },
  { time: "2026-09-29T01:00", temp: 21.6 },
]
```

---

## Data model

`fetchWeather(place, units?)` takes a place from `searchPlaces` and resolves to the object below. `units` defaults to metric, and every value comes back in the requested units.

```ts
{
  name: string;              // "Cairo"
  country: string;           // "Egypt"
  current: {
    time: string;            // "2026-09-29T14:00" (city local time)
    temp: number;            // whole degrees
    feelsLike: number;       // whole degrees
    humidity: number;        // %
    wind: number;            // whole km/h or mph
    precipitation: number;   // mm or inches
    code: number;            // WMO weather code
    isDay: 0 | 1;
  };
  daily: Array<{             // 7 entries
    date: string;            // "2026-09-29"
    code: number;
    max: number;
    min: number;
  }>;
  hourly: Array<{            // 168 entries (7 days × 24 hours)
    time: string;            // "2026-09-29T14:00"
    temp: number;
    code: number;
    isDay: 0 | 1;
  }>;
}
```

---

## Reference

### Components

| Component | Props | Description |
|---|---|---|
| `Container` | `children` | Page layout wrapper |
| `Navbar` | `units`, `onUnitsChange` | Logo, app name and the Units menu (closes on outside click or Escape) |
| `SearchBar` | `onSearch: (place) => Promise<boolean>`, `onNotFound`, `onError: (query) => void`, `loading` | Search box with a suggestions list (an accessible combobox). Supports mouse, **↑**/**↓**, **Enter** and **Esc**; the input clears only after the weather loads |
| `DayData` | `current`, `name`, `country` | Current conditions hero card |
| `Breakdown` | `current`, `units` | Feels like, humidity, wind and precipitation cards, with unit labels |
| `WeekDays` | `daily` | 7-day forecast cards |
| `HourlyForecast` | `hourly`, `daily`, `selectedDay`, `onDayChange` | Day dropdown and that day's 24 hourly temperatures |
| `DaySelect` | `days`, `value`, `onChange` | Custom dropdown (an accessible listbox) styled to match the design. Supports mouse, **↑**/**↓**, **Home**/**End**, **Enter**/**Space** and **Esc**; closes on outside click |

### Hook: `useWeather()`

| Returns | Type | Description |
|---|---|---|
| `weather` | `object \| null` | See [Data model](#data-model) |
| `search` | `(place, units?, keepDay?) => Promise<boolean>` | Fetches the weather for a chosen place. Resolves `true` on success. |
| `selectedDay` | `string` | Date shown in the hourly forecast |
| `setSelectedDay` | `(date: string) => void` | Changes the selected day |
| `units` | `object` | Current units |
| `changeUnits` | `(units) => void` | Saves new units and reloads the current place |
| `loading` | `false \| "new" \| "refresh"` | What is loading, see [State](#state) |
| `notFound` / `reportNotFound` | `boolean` / `() => void` | The "No search result found!" state |
| `error` / `reportSearchError` | `null \| { retry }` / `(query) => void` | The API error page and its Retry action |

### Hook: `usePlaceSearch(query)`

| Returns | Type | Description |
|---|---|---|
| `places` | `Array<Place>` | Up to 5 matches for the current text. Empty while searching or when the text is shorter than 2 characters |
| `searching` | `boolean` | `true` while waiting for results for the current text |
| `failed` | `boolean` | `true` when the last search failed, e.g. no connection |
| `searchNow` | `() => Promise<Array<Place>>` | Returns the current results, or searches immediately if they aren't ready yet |

A `Place` is `{ id, name, region, country, latitude, longitude }`.

### Utilities

| Function | Example | Result |
|---|---|---|
| `dayName(date, type?)` | `dayName("2026-09-29")` | `"Tuesday"` |
| | `dayName("2026-09-29", "short")` | `"Tue"` |
| `fullDate(time)` | `fullDate("2026-09-29T14:00")` | `"Tuesday, Sep 29, 2026"` |
| `hourLabel(time)` | `hourLabel("2026-09-29T14:00")` | `"2 PM"` |
| `getWeatherIcon(code)` | `getWeatherIcon(61)` | `{ src: icon-rain.webp, label: "Rain" }` |
| `isMetric(units)` | `isMetric(METRIC)` | `true` |

`units.js` also exports `METRIC`, `IMPERIAL`, `UNIT_OPTIONS` (the Units menu contents), `WIND_LABEL` and `PRECIPITATION_LABEL`.

`dayName` appends `T00:00` before parsing. On its own, a date-only string like `"2026-09-29"` is read as UTC, which shows the previous day in timezones west of UTC.

### Weather codes

`getWeatherIcon` maps [WMO weather codes](https://open-meteo.com/en/docs#weather_variable_documentation) to the design's icons. The label is used as the image's `alt` text, so screen readers announce the condition.

| Code | Label | Icon file |
|---|---|---|
| 0 | Clear sky | `icon-sunny.webp` |
| 1–2 | Partly cloudy | `icon-partly-cloudy.webp` |
| 3 | Overcast | `icon-overcast.webp` |
| 45–48 | Fog | `icon-fog.webp` |
| 51–57 | Drizzle | `icon-drizzle.webp` |
| 61–67 | Rain | `icon-rain.webp` |
| 71–77 | Snow | `icon-snow.webp` |
| 80–82 | Rain showers | `icon-rain.webp` |
| 85–86 | Snow showers | `icon-snow.webp` |
| 95–99 | Thunderstorm | `icon-storm.webp` |

---

## Known limitations

**Performance**

- Superseded weather requests are ignored but not cancelled, so they still finish downloading. (Place suggestion requests are cancelled.)

**Behaviour**

- Units and the last place aren't saved, so a page reload resets them.

**Layout and accessibility**

- The design has no night icons, so clear nights also show the sun icon.

**Project**

- There are no automated tests.

## Roadmap

- [x] Loading and error states
- [x] Metric / imperial unit switching
- [x] Choose between cities with the same name
- [x] Reuse coordinates when the units change
- [x] Fix the layout overflow caused by fixed `100vh` heights
- [x] Cache forecast and place results in `localStorage`
- [ ] Detect the user's location on first visit
- [ ] Remember the last searched city
- [x] Responsive from 320px to wide screens: side by side from 1200px, stacked below it, phone layout below 600px, extra-small tweaks below 360px
- [ ] Unit tests for `api/` and `utils/`

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request.

Please run `npm run lint` before submitting.

## Acknowledgements

- Weather and geocoding data by [Open-Meteo](https://open-meteo.com/), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Design, fonts and icons from the [Frontend Mentor](https://www.frontendmentor.io/) weather app challenge. Fonts licensed under the [SIL Open Font License](https://openfontlicense.org/)
- Weather codes follow the [WMO](https://open-meteo.com/en/docs#weather_variable_documentation) standard

---

<div align="center">

Built by [Belal-said](https://github.com/Belal-said)

</div>
