// src/utils/avatar.js
export function getInitial(name = "User") {
  const s = String(name || "").trim();
  return (s[0] || "U").toUpperCase();
}

export function stringToColor(str = "User") {
  // warna stabil per nama (biar tiap akun beda-beda tapi konsisten)
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 70% 45%)`;
}
