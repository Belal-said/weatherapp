import { useState } from "react";
import Container from "./components/Container";
import Navbar from "./components/Navbar";
import { GoSearch } from "react-icons/go";
import axios from "axios";

function App() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);

    const getIcon = (code, isDay) => {
        if (code === 0) return isDay ? "☀️" : "🌙"; // clear
        if (code <= 2) return isDay ? "🌤️" : "☁️"; // partly cloudy
        if (code === 3) return "☁️"; // overcast
        if (code <= 48) return "🌫️"; // fog
        if (code <= 67) return "🌧️"; // drizzle / rain
        if (code <= 77) return "❄️"; // snow
        if (code <= 82) return "🌦️"; // showers
        return "⛈️";
    };

    const fetchData = async () => {
        const respone = await axios.get(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}`,
        );

        const { name, latitude, longitude, country } = respone.data.results[0];

        const finalResponse = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,is_day,temperature_2m,weather_code&hourly=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`,
        );

        // Current data
        const c = finalResponse.data.current;
        const current = {
            temp: Math.round(c.temperature_2m),
            code: c.weather_code,
            isDay: c.is_day,
            time: c.time,
            feelsLike: Math.round(c.apparent_temperature),
            humidity: c.relative_humidity_2m,
            wind: Math.round(c.wind_speed_10m),
            precipitation: c.precipitation,
        };

        console.log("This is final: ", finalResponse);

        // Day by day through the week
        const {
            time: days,
            weather_code: codes,
            temperature_2m_max: max,
            temperature_2m_min: min,
        } = finalResponse.data.daily;

        const daily = days.map((day, index) => ({
            date: day,
            code: codes[index],
            max: Math.round(max[index]),
            min: Math.round(min[index]),
        }));

        // Around the clock
        const { time, weather_code, temperature_2m, is_day } =
            finalResponse.data.hourly;

        const hourly = time.map((time, index) => ({
            time: time,
            temp: temperature_2m[index],
            code: weather_code[index],
            isDay: is_day[index],
        }));

        return { name, country, hourly, daily, current };
    };

    const handleClick = async (city) => {
        const data = await fetchData(city);
        setWeather(data);
    };

    const { name, country, hourly, daily, current } = weather || {
        name: "",
        country: "",
        hourly: [],
        daily: [],
        current: {},
    };

    console.log("w", weather);

    const handleSubmit = async (e, city) => {
        e.preventDefault();
        const data = await fetchData(city);
        setWeather(data);
    };

    console.log(current.isDay);

    return (
        <Container>
            <Navbar />
            <h1>How's the sky looking today?</h1>
            <div className="body-container">
                <div className="search">
                    <div className="input-div">
                        <GoSearch />
                        <form action="" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={city}
                                placeholder="Search for a place..."
                                className="search-input"
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </form>
                    </div>
                    <button
                        onClick={() => handleClick(city)}
                        className="search-button"
                    >
                        Search
                    </button>
                </div>
                {weather && (
                    <div className="data">
                        <div className="main-data">
                            <div className="day-data">
                                <div>
                                    {current && (
                                        <div className="hero">
                                            <div className="hero-left">
                                                <h2>
                                                    <span className="city">
                                                        {name}
                                                    </span>
                                                    , {country}
                                                </h2>
                                                <p>
                                                    {new Date(
                                                        current.time,
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            weekday: "long",
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </p>
                                            </div>

                                            <div className="hero-right">
                                                <div className="day-icon">
                                                    <img
                                                        src={getIcon(
                                                            current.code,
                                                            current.isDay,
                                                        )}
                                                        alt=""
                                                    />
                                                </div>
                                                <span className="hero-temp">
                                                    {current.temp}°
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="breakdown">
                                <div className="breakdown-item">
                                    <span className="item-title">Feels Like </span>
                                    <span className="item-value">{current.feelsLike}°</span>
                                </div>
                                <div className="breakdown-item">
                                    <span className="item-title">Humidity</span>
                                    <span className="item-value">{current.humidity}%</span>
                                </div>
                                <div className="breakdown-item">
                                    <span className="item-title">Wind</span>
                                    <span className="item-value">{current.wind} km/h</span>
                                </div>
                                <div className="breakdown-item">
                                    <span className="item-title">Precipitation</span>
                                    <span className="item-value">{current.precipitation} mm</span>
                                </div>
                            </div>
                            <div className="week">
                                Daily Forecast
                                <div className="days">
                                    {daily.map((day, index) => {
                                        return (
                                            <div className="day" key={index}>
                                                {new Date(
                                                    day.date + "T00:00",
                                                ).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                })}
                                                <span className="icon">
                                                    {getIcon(day.code, 1)}
                                                </span>
                                                <div className="min-max">
                                                    {day.max}°{" "}
                                                    <span>{day.min}°</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="hourly-data">
                            <div className="hourly-data-header">
                                Hourly forecast{" "}
                                <select name="">
                                    Select a day
                                    <option value="Tuesday"></option>
                                </select>
                            </div>
                            <div className="hourly-div">
                                {hourly.map((item) => (
                                    <div
                                        className="hourly-temp"
                                        key={item.time}
                                    >
                                        <span className="item-time">
                                            <span>
                                                {getIcon(item.code, item.isDay)}
                                            </span>
                                            {new Date(item.time)
                                                .toLocaleDateString("en-US", {
                                                    hour: "numeric",
                                                })
                                                .slice(11)}
                                        </span>
                                        <span className="item-temp">
                                            {item.temp}°
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
}

export default App;
