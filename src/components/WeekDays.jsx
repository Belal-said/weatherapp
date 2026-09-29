import { getIcon } from "../utils/getIcon";
import { dayName } from "../utils/formatDate";

export default function WeekDays({ daily }) {
    return (
        <div className="week">
            Daily Forecast
            <div className="days">
                {daily.map((day) => (
                    <div className="day" key={day.date}>
                        {dayName(day.date, "short")}
                        <span className="icon" aria-hidden="true">
                            {getIcon(day.code, 1)}
                        </span>
                        <div className="min-max">
                            {day.max}° <span>{day.min}°</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
