// A small localStorage cache where every entry expires after a set time
const PREFIX = "weather-app:";
const MAX_ENTRIES = 30;

export const MINUTE = 60 * 1000;
export const DAY = 24 * 60 * MINUTE;

// All keys that belong to this app, so other sites' data is never touched
const appKeys = () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(PREFIX)) keys.push(key);
    }
    return keys;
};

const readEntry = (fullKey) => {
    try {
        return JSON.parse(localStorage.getItem(fullKey));
    } catch {
        return null;
    }
};

// Remove expired entries and, beyond MAX_ENTRIES, the oldest ones. clearAll empties the cache
const prune = (clearAll = false) => {
    try {
        const now = Date.now();
        const entries = appKeys().map((key) => ({ key, entry: readEntry(key) }));

        const valid = entries.filter(({ key, entry }) => {
            const keep = !clearAll && entry && entry.expires > now;
            if (!keep) localStorage.removeItem(key);
            return keep;
        });

        valid
            .sort((a, b) => b.entry.saved - a.entry.saved)
            .slice(MAX_ENTRIES)
            .forEach(({ key }) => localStorage.removeItem(key));
    } catch {
        // Storage unavailable (e.g. blocked in a private window): nothing to prune
    }
};

// Returns the cached value, or null when it's missing or expired
export const getCached = (key) => {
    try {
        const entry = readEntry(PREFIX + key);
        if (!entry) return null;

        if (entry.expires <= Date.now()) {
            localStorage.removeItem(PREFIX + key);
            return null;
        }
        return entry.value;
    } catch {
        return null;
    }
};

export const setCached = (key, value, ttl) => {
    const now = Date.now();
    const entry = JSON.stringify({ value, saved: now, expires: now + ttl });

    try {
        localStorage.setItem(PREFIX + key, entry);
    } catch {
        // Storage full: clear this app's cache and try once more
        prune(true);
        try {
            localStorage.setItem(PREFIX + key, entry);
        } catch {
            return; // Storage unavailable: the app works without caching
        }
    }
    prune();
};
