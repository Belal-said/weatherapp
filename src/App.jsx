import Container from "./components/Container";
import { useWeather } from "./hooks/useWeather";

// Components
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import HourlyForecast from "./components/HourlyForecast";
import WeekDays from "./components/WeekDays";
import Breakdown from "./components/Breakdown";
import DayData from "./components/DayData";

function App() {
    const { weather, search, selectedDay, setSelectedDay, units, changeUnits, loading, error } =
        useWeather();

    return (
        <Container>
            <Navbar units={units} onUnitsChange={changeUnits} />

            {/* <main> is the page's main landmark: everything below the header */}
            <main className="main-content">
                <h1>How’s the sky looking today?</h1>
                <div className="body-container">
                    <SearchBar onSearch={search} loading={loading} />

                    {error && (
                        <p className="status error" role="alert">
                            {error}
                        </p>
                    )}
                    {loading && !weather && <p className="status">Loading...</p>}

                    {weather && (
                        <div className="data">
                            <div className="main-data">
                                <DayData current={weather.current} country={weather.country} name={weather.name} />
                                <Breakdown current={weather.current} units={units} />
                                <WeekDays daily={weather.daily} />
                            </div>
                            <HourlyForecast
                                hourly={weather.hourly}
                                daily={weather.daily}
                                selectedDay={selectedDay}
                                onDayChange={setSelectedDay}
                            />
                        </div>
                    )}
                </div>
            </main>
        </Container>
    );
}

export default App;
