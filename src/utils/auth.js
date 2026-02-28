const LOGIN_KEY = "chill_logged_in";
const USERS_KEY = "chill_users";        // list user
const CURRENT_USER_KEY = "chill_user";  // user yang sedang login

export function isLoggedIn() {
  return localStorage.getItem(LOGIN_KEY) === "true";
}

export function getRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveRegisteredUser({ username, email, password, avatar = "" }) {
  const users = getRegisteredUsers();

  if (!username || !email || !password) {
    return { ok: false, message: "Semua field wajib diisi." };
  }

  const exists = users.some((u) => u.email === email);
  if (exists) return { ok: false, message: "Email sudah terdaftar." };

  const newUser = { username, email, password, avatar };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  return { ok: true, user: newUser };
}

export function login({ email, password }) {
  const users = getRegisteredUsers();
  const found = users.find((u) => u.email === email && u.password === password);

  if (!found) return { ok: false, message: "Email atau password salah." };

  localStorage.setItem(LOGIN_KEY, "true");
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found)); // ✅ simpan current user
  return { ok: true, user: found };
}

export function logout() {
  localStorage.removeItem(LOGIN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function updateCurrentUser(partial) {
  const current = getCurrentUser();
  if (!current) return { ok: false, message: "Belum login." };

  const oldEmail = current.email;
  const updated = { ...current, ...partial };

  // update current user
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));

  // update juga di list users (cari pakai email LAMA)
  const users = getRegisteredUsers();
  const nextUsers = users.map((u) =>
    u.email === oldEmail ? updated : u
  );
  localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));

  return { ok: true, user: updated };
}

export function updateAvatar(avatarDataUrl) {
  if (!avatarDataUrl) return { ok: false, message: "Avatar kosong." };
  return updateCurrentUser({ avatar: avatarDataUrl });
}
