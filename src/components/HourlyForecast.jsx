import { getIcon } from "../utils/getIcon";
import { hourLabel } from "../utils/formatDate";
import DaySelect from "./DaySelect";

const HourlyForecast = ({ hourly, daily, selectedDay, onDayChange }) => {
    const dayHours = hourly.filter((hour) => hour.time.startsWith(selectedDay));

    return (
        <div className="hourly-data">
            <div className="hourly-data-header">
                <h4>Hourly Forecast</h4>
                <DaySelect days={daily.map((day) => day.date)} value={selectedDay} onChange={onDayChange} />
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
