// Unit systems, using the values Open-Meteo expects in its query string
export const METRIC = { temperature: "celsius", wind: "kmh", precipitation: "mm" };
export const IMPERIAL = { temperature: "fahrenheit", wind: "mph", precipitation: "inch" };

// Options shown in the Units menu
export const UNIT_OPTIONS = {
    temperature: {
        title: "Temperature",
        options: [
            { value: "celsius", label: "Celsius (°C)" },
            { value: "fahrenheit", label: "Fahrenheit (°F)" },
        ],
    },
    wind: {
        title: "Wind Speed",
        options: [
            { value: "kmh", label: "km/h" },
            { value: "mph", label: "mph" },
        ],
    },
    precipitation: {
        title: "Precipitation",
        options: [
            { value: "mm", label: "Millimeters (mm)" },
            { value: "inch", label: "Inches (in)" },
        ],
    },
};

// Short labels displayed next to values
export const WIND_LABEL = { kmh: "km/h", mph: "mph" };
export const PRECIPITATION_LABEL = { mm: "mm", inch: "in" };

export const isMetric = (units) =>
    units.temperature === METRIC.temperature &&
    units.wind === METRIC.wind &&
    units.precipitation === METRIC.precipitation;
