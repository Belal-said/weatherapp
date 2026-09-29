// "T00:00" makes a date-only string parse as local time instead of UTC
export const dayName = (date, type = "long") =>
    new Date(date + "T00:00").toLocaleDateString("en-US", { weekday: type });

export const hourLabel = (time) =>
    new Date(time).toLocaleTimeString("en-US", { hour: "numeric" });

export const fullDate = (time) =>
    new Date(time).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
