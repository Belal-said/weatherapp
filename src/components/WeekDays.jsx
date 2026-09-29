import { getWeatherIcon } from "../utils/weatherIcon";
import { dayName } from "../utils/formatDate";

export default function WeekDays({ daily }) {
    return (
        <section className="week" aria-labelledby="daily-title">
            <h3 className="section-title" id="daily-title">
                Daily forecast
            </h3>
            <div className="days">
                {daily.map((day) => {
                    const icon = getWeatherIcon(day.code);
                    return (
                        <div className="day" key={day.date}>
                            <span className="day-name">{dayName(day.date, "short")}</span>
                            <img className="icon" src={icon.src} alt={icon.label} />
                            <div className="min-max">
                                <span>{day.max}°</span>
                                <span>{day.min}°</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
