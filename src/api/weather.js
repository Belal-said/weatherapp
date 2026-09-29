import axios from "axios";
import { METRIC } from "../utils/units";

// Find up to 5 places matching the text, e.g. "Paris" -> Paris (France), Paris (Texas), ...
export const searchPlaces = async (query, signal) => {
    // encodeURIComponent keeps names with spaces or special characters URL-safe
    const geo = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`,
        { signal },
    );

    // No match: the response has no "results" field
    return (geo.data.results ?? []).map((place) => ({
        id: place.id,
        name: place.name,
        region: place.admin1,
        country: place.country,
        latitude: place.latitude,
        longitude: place.longitude,
    }));
};

// Fetch the weather for a place returned by searchPlaces
export const fetchWeather = async (place, units = METRIC) => {
    const { name, country, latitude, longitude } = place;

    const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
            `&current=apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,is_day,temperature_2m,weather_code` +
            `&hourly=temperature_2m,weather_code,is_day` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
            `&temperature_unit=${units.temperature}` +
            `&wind_speed_unit=${units.wind}` +
            `&precipitation_unit=${units.precipitation}` +
            `&forecast_days=7&timezone=auto`,
    );

    const { current: c, hourly: h, daily: d } = res.data;

    return {
        name,
        country,
        current: {
            temp: Math.round(c.temperature_2m),
            code: c.weather_code,
            isDay: c.is_day,
            time: c.time,
            humidity: c.relative_humidity_2m,
            feelsLike: Math.round(c.apparent_temperature),
            wind: Math.round(c.wind_speed_10m),
            precipitation: c.precipitation,
        },
        daily: d.time.map((date, index) => ({
            date,
            code: d.weather_code[index],
            max: Math.round(d.temperature_2m_max[index]),
            min: Math.round(d.temperature_2m_min[index]),
        })),
        hourly: h.time.map((time, index) => ({
            time,
            temp: Math.round(h.temperature_2m[index]),
            code: h.weather_code[index],
            isDay: h.is_day[index],
        })),
    };
};
