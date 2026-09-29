import { useState } from "react";
import { GoSearch } from "react-icons/go";

const SearchBar = ({ onSearch, loading }) => {
    const [city, setCity] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const found = await onSearch(city);
        // Keep the text on failure so the user can fix a typo
        if (found) setCity("");
    };

    return (
        <form className="search" onSubmit={handleSubmit}>
            <div className="input-div">
                <GoSearch aria-hidden="true" />
                <input
                    type="text"
                    value={city}
                    placeholder="Search for a place..."
                    aria-label="City name"
                    className="search-input"
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>
            <button type="submit" className="search-button" disabled={loading}>
                {loading ? "Searching..." : "Search"}
            </button>
        </form>
    );
};

export default SearchBar;
