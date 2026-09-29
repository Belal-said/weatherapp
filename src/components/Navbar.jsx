import { useRef, useState } from "react";
import { IoCheckmark, IoChevronDown, IoSettingsOutline } from "react-icons/io5";
import logo from "../images/image.png";
import { useDismiss } from "../hooks/useDismiss";
import { IMPERIAL, METRIC, UNIT_OPTIONS, isMetric } from "../utils/units";

export default function Navbar({ units, onUnitsChange }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const metric = isMetric(units);

    // Close the menu when clicking outside it or pressing Escape
    useDismiss(menuRef, open, () => setOpen(false));

    return (
        <div className="navbar">
            <div className="logo-name-container">
                <img src={logo} className="logo-image" alt="" />
                <p className="weather-app">Weather App</p>
            </div>

            <div className="units" ref={menuRef}>
                <button
                    type="button"
                    className="units-button"
                    aria-haspopup="true"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                >
                    <IoSettingsOutline aria-hidden="true" /> Units <IoChevronDown aria-hidden="true" />
                </button>

                {open && (
                    <div className="units-menu">
                        <button
                            type="button"
                            className="units-switch"
                            onClick={() => onUnitsChange(metric ? IMPERIAL : METRIC)}
                        >
                            Switch to {metric ? "Imperial" : "Metric"}
                        </button>

                        {Object.entries(UNIT_OPTIONS).map(([key, group]) => (
                            <div className="units-group" key={key}>
                                <p className="units-group-title">{group.title}</p>
                                {group.options.map((option) => {
                                    const active = units[key] === option.value;
                                    return (
                                        <button
                                            type="button"
                                            key={option.value}
                                            className={`units-option${active ? " active" : ""}`}
                                            aria-pressed={active}
                                            onClick={() =>
                                                !active && onUnitsChange({ ...units, [key]: option.value })
                                            }
                                        >
                                            {option.label}
                                            {active && <IoCheckmark aria-hidden="true" />}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
