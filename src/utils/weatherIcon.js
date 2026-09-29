import sunny from "../assets/images/icon-sunny.webp";
import partlyCloudy from "../assets/images/icon-partly-cloudy.webp";
import overcast from "../assets/images/icon-overcast.webp";
import fog from "../assets/images/icon-fog.webp";
import drizzle from "../assets/images/icon-drizzle.webp";
import rain from "../assets/images/icon-rain.webp";
import snow from "../assets/images/icon-snow.webp";
import storm from "../assets/images/icon-storm.webp";

// WMO weather code ranges -> the design's icon and a label (used as the image's alt text)
// https://open-meteo.com/en/docs#weather_variable_documentation
const CONDITIONS = [
    { upTo: 0, src: sunny, label: "Clear sky" },
    { upTo: 2, src: partlyCloudy, label: "Partly cloudy" },
    { upTo: 3, src: overcast, label: "Overcast" },
    { upTo: 48, src: fog, label: "Fog" },
    { upTo: 57, src: drizzle, label: "Drizzle" },
    { upTo: 67, src: rain, label: "Rain" },
    { upTo: 77, src: snow, label: "Snow" },
    { upTo: 82, src: rain, label: "Rain showers" },
    { upTo: 86, src: snow, label: "Snow showers" },
    { upTo: 99, src: storm, label: "Thunderstorm" },
];

// Returns { src, label } for a weather code
export const getWeatherIcon = (code) => CONDITIONS.find((c) => code <= c.upTo) ?? CONDITIONS.at(-1);
