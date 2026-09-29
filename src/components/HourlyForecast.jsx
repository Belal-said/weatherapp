import { getWeatherIcon } from "../utils/weatherIcon";
import { hourLabel } from "../utils/formatDate";
import DaySelect from "./DaySelect";

const SKELETON_HOURS = 8;

const HourlyForecast = ({ hourly, daily, selectedDay, onDayChange }) => {
    const loading = !hourly;
    const dayHours = loading ? [] : hourly.filter((hour) => hour.time.startsWith(selectedDay));

    return (
        <section className="hourly-data" aria-labelledby="hourly-title">
            <div className="hourly-data-header">
                <h3 className="section-title" id="hourly-title">
                    Hourly forecast
                </h3>
                <DaySelect
                    days={daily?.map((day) => day.date) ?? []}
                    value={selectedDay}
                    onChange={onDayChange}
                    disabled={loading}
                />
            </div>
            <div className="hourly-div">
                {/* Loading: empty rows, like the design */}
                {loading &&
                    Array.from({ length: SKELETON_HOURS }, (_, index) => (
                        <div className="hourly-temp skeleton" key={index} aria-hidden="true" />
                    ))}

                {dayHours.map((item) => {
                    const icon = getWeatherIcon(item.code);
                    return (
                        <div className="hourly-temp" key={item.time}>
                            <span className="item-time">
                                <img src={icon.src} alt={icon.label} />
                                {hourLabel(item.time)}
                            </span>
                            <span className="item-temp">{item.temp}°</span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default HourlyForecast;
