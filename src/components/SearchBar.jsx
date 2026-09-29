import { useState } from "react";
import searchIcon from "../assets/images/icon-search.svg";
import { usePlaceSearch } from "../hooks/usePlaceSearch";

// "Île-de-France, France"
const placeDetails = (place) => [place.region, place.country].filter(Boolean).join(", ");

const SearchBar = ({ onSearch, loading }) => {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const { places, searching, failed, searchNow } = usePlaceSearch(query);

    const current = Math.min(active, places.length - 1);
    const showList = open && query.trim().length >= 2;

    const choose = async (place) => {
        setOpen(false);
        const found = await onSearch(place);
        if (found) setQuery("");
    };

    // Enter or the Search button picks the highlighted suggestion (the first by default)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            const results = await searchNow();
            if (results.length) choose(results[Math.max(current, 0)]);
            else setOpen(true);
        } catch {
            setOpen(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive(Math.min(current + 1, places.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive(Math.max(current - 1, 0));
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    return (
        <form className="search" onSubmit={handleSubmit}>
            <div className="input-div">
                <img className="search-icon" src={searchIcon} alt="" />
                <input
                    type="text"
                    value={query}
                    placeholder="Search for a place..."
                    aria-label="City name"
                    className="search-input"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={showList}
                    aria-controls="place-list"
                    aria-activedescendant={showList && places.length ? `place-${places[current].id}` : undefined}
                    autoComplete="off"
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setActive(0);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setOpen(false)}
                    onKeyDown={handleKeyDown}
                />

                {showList && (
                    <ul className="suggestions" id="place-list" role="listbox">
                        {searching && <li className="suggestion-status">Searching...</li>}
                        {failed && <li className="suggestion-status">Couldn’t search for places. Try again.</li>}
                        {!searching && !failed && places.length === 0 && (
                            <li className="suggestion-status">No places found for “{query.trim()}”.</li>
                        )}
                        {places.map((place, index) => (
                            <li
                                key={place.id}
                                id={`place-${place.id}`}
                                role="option"
                                aria-selected={index === current}
                                className={`suggestion${index === current ? " active" : ""}`}
                                // Keep focus in the input so onBlur doesn't close the list before the click
                                onMouseDown={(e) => e.preventDefault()}
                                onMouseEnter={() => setActive(index)}
                                onClick={() => choose(place)}
                            >
                                <span className="suggestion-name">{place.name}</span>
                                <span className="suggestion-details">{placeDetails(place)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button type="submit" className="search-button" disabled={loading}>
                {loading ? "Loading..." : "Search"}
            </button>
        </form>
    );
};

export default SearchBar;
