import { useRef, useState } from "react";
import { fetchWeather } from "../api/weather";
import { METRIC } from "../utils/units";

// Turn an error into a message that says what actually went wrong
const errorMessage = (err) => {
    // The server answered with an error status
    if (err.response) {
        const reason = err.response.data?.reason;
        if (err.response.status === 429) return "Too many requests to the weather service. Wait a minute and try again.";
        return `The weather service returned an error (${err.response.status})${reason ? `: ${reason}` : ""}.`;
    }
    // The request was sent but nothing came back (offline, blocked, or timed out)
    if (err.request) return "Couldn't reach the weather service. Check your connection and try again.";
    // A bug in the app itself
    return "Something went wrong while showing the weather. Details are in the browser console.";
};

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
        } catch (err) {
            // Keep the real cause in the console so failures can be debugged
            console.error("Failed to load the weather:", err);
            if (id === requestId.current) setError(errorMessage(err));
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
