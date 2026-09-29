import { useEffect } from "react";

// While open, calls onDismiss when the user clicks outside ref's element or presses Escape
export const useDismiss = (ref, open, onDismiss) => {
    useEffect(() => {
        if (!open) return;

        const handleClick = (e) => {
            if (!ref.current?.contains(e.target)) onDismiss();
        };
        const handleKey = (e) => {
            if (e.key === "Escape") onDismiss();
        };

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [ref, open, onDismiss]);
};
