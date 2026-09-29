import { PRECIPITATION_LABEL, WIND_LABEL } from "../utils/units";

export default function Breakdown({ current, units }) {
    return (
        <div className="breakdown">
            <div className="breakdown-item">
                <span className="item-title">Feels Like</span>
                <span className="item-value">{current.feelsLike}°</span>
            </div>
            <div className="breakdown-item">
                <span className="item-title">Humidity</span>
                <span className="item-value">{current.humidity}%</span>
            </div>
            <div className="breakdown-item">
                <span className="item-title">Wind</span>
                <span className="item-value">
                    {current.wind} {WIND_LABEL[units.wind]}
                </span>
            </div>
            <div className="breakdown-item">
                <span className="item-title">Precipitation</span>
                <span className="item-value">
                    {current.precipitation} {PRECIPITATION_LABEL[units.precipitation]}
                </span>
            </div>
        </div>
    );
}
