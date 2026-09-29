export const getIcon = (code, isDay) => {
    if (code === 0) return isDay ? "☀️" : "🌙"; // clear
    if (code <= 2) return isDay ? "🌤️" : "☁️"; // partly cloudy
    if (code === 3) return "☁️"; // overcast
    if (code <= 48) return "🌫️"; // fog
    if (code <= 67) return "🌧️"; // drizzle / rain
    if (code <= 77) return "❄️"; // snow
    if (code <= 82) return "🌦️"; // showers
    return "⛈️";
};
