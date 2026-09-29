import { useEffect, useRef, useState } from "react";
import checkIcon from "../assets/images/icon-checkmark.svg";
import dropdownIcon from "../assets/images/icon-dropdown.svg";
import { useDismiss } from "../hooks/useDismiss";
import { dayName } from "../utils/formatDate";

// Custom dropdown for choosing a day, styled to match the design (a native <select> can't be)
export default function DaySelect({ days, value, onChange }) {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const rootRef = useRef(null);
    const buttonRef = useRef(null);
    const listRef = useRef(null);

    useDismiss(rootRef, open, () => setOpen(false));

    // Move keyboard focus into the list when it opens
    useEffect(() => {
        if (open) listRef.current?.focus();
    }, [open]);

    const openList = () => {
        setActive(Math.max(days.indexOf(value), 0));
        setOpen(true);
    };

    const close = () => {
        setOpen(false);
        buttonRef.current?.focus();
    };

    const select = (day) => {
        onChange(day);
        close();
    };

    const handleButtonKeyDown = (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openList();
        }
    };

    const handleListKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, days.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
        } else if (e.key === "Home") {
            e.preventDefault();
            setActive(0);
        } else if (e.key === "End") {
            e.preventDefault();
            setActive(days.length - 1);
        } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            select(days[active]);
        } else if (e.key === "Escape") {
            e.preventDefault();
            close();
        } else if (e.key === "Tab") {
            setOpen(false);
        }
    };

    return (
        <div className="day-select" ref={rootRef}>
            <button
                type="button"
                ref={buttonRef}
                className="day-select-button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`Day: ${dayName(value)}`}
                onClick={() => (open ? setOpen(false) : openList())}
                onKeyDown={handleButtonKeyDown}
            >
                {dayName(value)}
                <img src={dropdownIcon} alt="" className={`day-select-chevron${open ? " open" : ""}`} />
            </button>

            {open && (
                <ul
                    ref={listRef}
                    className="day-select-menu"
                    role="listbox"
                    tabIndex={-1}
                    aria-label="Select a day"
                    aria-activedescendant={`day-${days[active]}`}
                    onKeyDown={handleListKeyDown}
                >
                    {days.map((day, index) => {
                        const selected = day === value;
                        return (
                            <li
                                key={day}
                                id={`day-${day}`}
                                role="option"
                                aria-selected={selected}
                                className={`day-select-option${index === active ? " active" : ""}${selected ? " selected" : ""}`}
                                onMouseEnter={() => setActive(index)}
                                onClick={() => select(day)}
                            >
                                {dayName(day)}
                                {selected && <img src={checkIcon} alt="" />}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
