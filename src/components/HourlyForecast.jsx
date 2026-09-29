import { getWeatherIcon } from "../utils/weatherIcon";
import { hourLabel } from "../utils/formatDate";
import DaySelect from "./DaySelect";

const HourlyForecast = ({ hourly, daily, selectedDay, onDayChange }) => {
    const dayHours = hourly.filter((hour) => hour.time.startsWith(selectedDay));

    return (
        <section className="hourly-data" aria-labelledby="hourly-title">
            <div className="hourly-data-header">
                <h3 className="section-title" id="hourly-title">
                    Hourly forecast
                </h3>
                <DaySelect days={daily.map((day) => day.date)} value={selectedDay} onChange={onDayChange} />
            </div>
            <div className="hourly-div">
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
