// Simple local storage utility acting as a shared "local directory"

export const STORAGE_KEYS = {
  leaves: 'hostelLeaves',
  notices: 'hostelNotices',
  helpRequests: 'hostelHelpRequests',
  lostFoundItems: 'hostelLostFoundItems',
} as const;

export function readJsonFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch (_err) {
    return fallback;
  }
}

export function writeJsonToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_err) {
    // no-op
  }
}


