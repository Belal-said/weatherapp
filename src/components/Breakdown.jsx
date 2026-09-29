import { PRECIPITATION_LABEL, WIND_LABEL } from "../utils/units";

// While loading (no data yet) every value shows "–", like the design
export default function Breakdown({ current, units }) {
    const show = (value) => (current ? value : "–");

    return (
        <div className="breakdown">
            <div className="breakdown-item">
                <span className="item-title">Feels Like</span>
                <span className="item-value">{show(`${current?.feelsLike}°`)}</span>
            </div>
            <div className="breakdown-item">
                <span className="item-title">Humidity</span>
                <span className="item-value">{show(`${current?.humidity}%`)}</span>
            </div>
            <div className="breakdown-item">
                <span className="item-title">Wind</span>
                <span className="item-value">{show(`${current?.wind} ${WIND_LABEL[units.wind]}`)}</span>
            </div>
            <div className="breakdown-item">
                <span className="item-title">Precipitation</span>
                <span className="item-value">
                    {show(`${current?.precipitation} ${PRECIPITATION_LABEL[units.precipitation]}`)}
                </span>
            </div>
        </div>
    );
}
