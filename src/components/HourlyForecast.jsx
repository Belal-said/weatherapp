import { getIcon } from "../utils/getIcon";
import { dayName, hourLabel } from "../utils/formatDate";

const HourlyForecast = ({ hourly, daily, selectedDay, onDayChange }) => {
    const dayHours = hourly.filter((hour) => hour.time.startsWith(selectedDay));

    return (
        <div className="hourly-data">
            <div className="hourly-data-header">
                <h4>Hourly Forecast</h4>
                <select
                    className="day-selector"
                    aria-label="Select a day"
                    value={selectedDay}
                    onChange={(event) => onDayChange(event.target.value)}
                >
                    {daily.map((day) => (
                        <option key={day.date} value={day.date}>
                            {dayName(day.date, "long")}
                        </option>
                    ))}
                </select>
            </div>
            <div className="hourly-div">
                {dayHours.map((item) => (
                    <div className="hourly-temp" key={item.time}>
                        <span className="item-time">
                            <span aria-hidden="true">{getIcon(item.code, item.isDay)}</span>
                            {hourLabel(item.time)}
                        </span>
                        <span className="item-temp">{item.temp}°</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HourlyForecast;
