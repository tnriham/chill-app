const KEY = "chill_subscription";

export function getSubscription() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSubscription(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearSubscription() {
  localStorage.removeItem(KEY);
}
