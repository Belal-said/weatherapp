import { useRef, useState } from "react";
import logo from "../assets/images/logo.svg";
import unitsIcon from "../assets/images/icon-units.svg";
import dropdownIcon from "../assets/images/icon-dropdown.svg";
import checkIcon from "../assets/images/icon-checkmark.svg";
import { useDismiss } from "../hooks/useDismiss";
import { IMPERIAL, METRIC, UNIT_OPTIONS, isMetric } from "../utils/units";

export default function Navbar({ units, onUnitsChange }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const metric = isMetric(units);

    // Close the menu when clicking outside it or pressing Escape
    useDismiss(menuRef, open, () => setOpen(false));

    return (
        // <header> is the page's banner landmark
        <header className="navbar">
            <img src={logo} className="logo" alt="Weather Now" />

            <div className="units" ref={menuRef}>
                <button
                    type="button"
                    className="units-button"
                    aria-haspopup="true"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                >
                    <img src={unitsIcon} alt="" /> Units <img src={dropdownIcon} alt="" />
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
                                            {active && <img src={checkIcon} alt="" />}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
}
