// simple storage abstraction: localStorage in browsers, in-memory fallback for Node
const inMemory = new Map();

export function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function save(key, value) {
  const str = JSON.stringify(value);
  if (isBrowser()) {
    window.localStorage.setItem(key, str);
  } else {
    inMemory.set(key, str);
  }
}

export function load(key) {
  try {
    if (isBrowser()) {
      const str = window.localStorage.getItem(key);
      return str ? JSON.parse(str) : null;
    } else {
      const str = inMemory.get(key);
      return str ? JSON.parse(str) : null;
    }
  } catch (e) {
    return null;
  }
}

export function remove(key) {
  if (isBrowser()) {
    window.localStorage.removeItem(key);
  } else {
    inMemory.delete(key);
  }
}