import { useEffect, useState } from "react";
import { searchPlaces } from "../api/weather";

const MIN_LENGTH = 2;
const DELAY = 300; // ms to wait after the last keystroke

// Place suggestions for the search box, fetched shortly after the user stops typing
export const usePlaceSearch = (query) => {
    const [found, setFound] = useState({ query: "", places: [], failed: false });
    const text = query.trim();
    const enabled = text.length >= MIN_LENGTH;

    useEffect(() => {
        if (!enabled) return;

        // Cancel the previous request when the text changes
        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                const places = await searchPlaces(text, controller.signal);
                setFound({ query: text, places, failed: false });
            } catch (err) {
                if (controller.signal.aborted) return; // cancelled on purpose, not a failure
                console.error("Failed to search for places:", err);
                setFound({ query: text, places: [], failed: true });
            }
        }, DELAY);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [text, enabled]);

    // Only use results that belong to the current text
    const ready = enabled && found.query === text;

    return {
        places: ready ? found.places : [],
        searching: enabled && !ready,
        failed: ready && found.failed,
        // Search right away, e.g. when Enter is pressed before the suggestions arrive
        searchNow: async () => (ready && !found.failed ? found.places : searchPlaces(text)),
    };
};
