import { useRef, useState } from "react";
import { fetchWeather, searchPlaces } from "../api/weather";
import { METRIC } from "../utils/units";

export const useWeather = () => {
    const [weather, setWeather] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");
    const [units, setUnits] = useState(METRIC);
    // false, "new" (a different place: show the skeleton) or "refresh" (same place, e.g. new units)
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    // null, or { retry } for the API error page
    const [error, setError] = useState(null);
    const [lastPlace, setLastPlace] = useState(null);

    // Id of the latest request, so an older, slower response can't overwrite a newer one
    const requestId = useRef(0);

    // Loads the weather for a place chosen in the search bar. Returns true on success
    const search = async (place, searchUnits = units, keepDay = false) => {
        const id = ++requestId.current;
        setLoading(keepDay ? "refresh" : "new");
        setError(null);
        setNotFound(false);

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
            if (id === requestId.current) setError({ retry: () => search(place, searchUnits, keepDay) });
            return false;
        } finally {
            if (id === requestId.current) setLoading(false);
        }
    };

    // Looks up the text and loads its best match (used to retry a failed place search)
    const searchByText = async (query) => {
        const id = ++requestId.current;
        setLoading("new");
        setError(null);

        try {
            const places = await searchPlaces(query);
            if (id !== requestId.current) return false;
            if (!places.length) {
                setLoading(false);
                setNotFound(true);
                return false;
            }
            return search(places[0]);
        } catch (err) {
            console.error("Failed to search for places:", err);
            if (id === requestId.current) {
                setLoading(false);
                setError({ retry: () => searchByText(query) });
            }
            return false;
        }
    };

    // Called by the search bar when a search has no matching place
    const reportNotFound = () => {
        requestId.current++; // ignore any weather request still running
        setLoading(false);
        setError(null);
        setNotFound(true);
    };

    // Called by the search bar when the place search itself failed
    const reportSearchError = (query) => {
        setError({ retry: () => searchByText(query) });
    };

    // Save the new units and reload the current place with them (no new city lookup needed)
    const changeUnits = (nextUnits) => {
        setUnits(nextUnits);
        if (lastPlace) search(lastPlace, nextUnits, true);
    };

    return {
        weather,
        search,
        selectedDay,
        setSelectedDay,
        units,
        changeUnits,
        loading,
        notFound,
        reportNotFound,
        error,
        reportSearchError,
    };
};
