import axios from "axios";
import { METRIC } from "../utils/units";

export const fetchWeather = async (city, units = METRIC) => {
    // Get latitude and longitude of the given city
    // encodeURIComponent keeps names with spaces or special characters URL-safe
    const geo = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
    );

    // Validation statement
    if (!geo.data.results) return null;

    // Extract needed data from geo response
    const { name, latitude, longitude, country } = geo.data.results[0];

    // Fetch weather data with latitude and longitude
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
