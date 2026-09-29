import Container from "./components/Container";
import { useWeather } from "./hooks/useWeather";

// Components
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import HourlyForecast from "./components/HourlyForecast";
import WeekDays from "./components/WeekDays";
import Breakdown from "./components/Breakdown";
import DayData from "./components/DayData";
import ErrorState from "./components/ErrorState";

function App() {
    const {
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
    } = useWeather();

    // Loading a different place shows the skeleton; the components render it when given no data
    const skeleton = loading === "new";
    const shown = skeleton ? null : weather;

    return (
        <Container>
            <Navbar units={units} onUnitsChange={changeUnits} />

            {/* <main> is the page's main landmark: everything below the header */}
            <main className="main-content">
                {error ? (
                    <ErrorState onRetry={error.retry} />
                ) : (
                    <>
                        <h1>How’s the sky looking today?</h1>
                        <div className="body-container">
                            <SearchBar
                                onSearch={search}
                                onNotFound={reportNotFound}
                                onError={reportSearchError}
                                loading={Boolean(loading)}
                            />

                            {notFound && (
                                <p className="no-results" role="status">
                                    No search result found!
                                </p>
                            )}

                            {!notFound && (shown || skeleton) && (
                                <div className="data" aria-busy={skeleton}>
                                    <div className="main-data">
                                        <DayData
                                            current={shown?.current}
                                            country={shown?.country}
                                            name={shown?.name}
                                        />
                                        <Breakdown current={shown?.current} units={units} />
                                        <WeekDays daily={shown?.daily} />
                                    </div>
                                    <HourlyForecast
                                        hourly={shown?.hourly}
                                        daily={shown?.daily}
                                        selectedDay={selectedDay}
                                        onDayChange={setSelectedDay}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </Container>
    );
}

export default App;
