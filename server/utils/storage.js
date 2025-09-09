// utils/storage.js
export const safeLocalStorage = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.warn(`Error parsing localStorage[${key}]:`, err);
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`Error saving localStorage[${key}]:`, err);
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};
