import { useRef, useState } from "react";
import { fetchWeather } from "../api/weather";
import { METRIC } from "../utils/units";

export const useWeather = () => {
    const [weather, setWeather] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");
    const [units, setUnits] = useState(METRIC);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lastCity, setLastCity] = useState("");

    // Id of the latest request, so an older, slower response can't overwrite a newer one
    const requestId = useRef(0);

    // Returns true when the search succeeded
    const search = async (city, searchUnits = units, keepDay = false) => {
        if (!city.trim()) return false;

        const id = ++requestId.current;
        setLoading(true);
        setError("");

        try {
            const data = await fetchWeather(city, searchUnits);
            if (id !== requestId.current) return false;

            if (!data) {
                setError(`No results found for "${city}".`);
                return false;
            }

            setWeather(data);
            setLastCity(city);
            if (!keepDay) setSelectedDay(data.daily[0].date);
            return true;
        } catch {
            if (id === requestId.current) {
                setError("Couldn't load the weather. Check your connection and try again.");
            }
            return false;
        } finally {
            if (id === requestId.current) setLoading(false);
        }
    };

    // Save the new units and reload the current city with them
    const changeUnits = (nextUnits) => {
        setUnits(nextUnits);
        if (lastCity) search(lastCity, nextUnits, true);
    };

    return { weather, search, selectedDay, setSelectedDay, units, changeUnits, loading, error };
};
