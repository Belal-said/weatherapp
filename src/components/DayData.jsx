import { getIcon } from "../utils/getIcon";
import { fullDate } from "../utils/formatDate";

export default function DayData({ current, country, name }) {
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
                    <span className="day-icon" aria-hidden="true">
                        {getIcon(current.code, current.isDay)}
                    </span>
                    <span className="hero-temp">{current.temp}°</span>
                </div>
            </div>
        </div>
    );
}
