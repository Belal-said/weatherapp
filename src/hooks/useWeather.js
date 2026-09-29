import { useRef, useState } from "react";
import { fetchWeather } from "../api/weather";
import { METRIC } from "../utils/units";

export const useWeather = () => {
    const [weather, setWeather] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");
    const [units, setUnits] = useState(METRIC);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lastPlace, setLastPlace] = useState(null);

    // Id of the latest request, so an older, slower response can't overwrite a newer one
    const requestId = useRef(0);

    // Loads the weather for a place chosen in the search bar. Returns true on success
    const search = async (place, searchUnits = units, keepDay = false) => {
        const id = ++requestId.current;
        setLoading(true);
        setError("");

        try {
            const data = await fetchWeather(place, searchUnits);
            if (id !== requestId.current) return false;

            setWeather(data);
            setLastPlace(place);
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

    // Save the new units and reload the current place with them (no new city lookup needed)
    const changeUnits = (nextUnits) => {
        setUnits(nextUnits);
        if (lastPlace) search(lastPlace, nextUnits, true);
    };

    return { weather, search, selectedDay, setSelectedDay, units, changeUnits, loading, error };
};
