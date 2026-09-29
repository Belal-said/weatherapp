import { getWeatherIcon } from "../utils/weatherIcon";
import { fullDate } from "../utils/formatDate";

export default function DayData({ current, country, name }) {
    const icon = getWeatherIcon(current.code);

    return (
        <div className="day-data">
            <div className="hero">
                <div className="hero-left">
                    <h2>
                        <span className="city">{name}</span>, {country}
                    </h2>
                    <p>{fullDate(current.time)}</p>
                </div>

                <div className="hero-right">
                    <img className="day-icon" src={icon.src} alt={icon.label} />
                    <span className="hero-temp">{current.temp}°</span>
                </div>
            </div>
        </div>
    );
}
