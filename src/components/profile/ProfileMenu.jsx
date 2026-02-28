// src/components/profile/ProfileMenu.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../../utils/auth.js";

export default function ProfileMenu() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  // ✅ Ambil user yang sedang login (tiap akun beda)
  const user = useMemo(() => {
    const u = getCurrentUser();
    return u || { username: "User", email: "user@email.com", avatar: "" };
  }, []);

  // close kalau klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const go = (to) => {
    setOpen(false);
    nav(to);
  };

  const isActiveProfile = pathname === "/profile";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger (avatar + caret) */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="profile menu"
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          color: "white",
        }}
      >
        <AvatarCircle user={user} size={30} />
        <span
          style={{
            fontSize: 12,
            opacity: 0.85,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .15s ease",
            lineHeight: 1,
          }}
        >
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 10px)",
            width: 280,
            background: "#2f3338",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 18px 40px rgba(0,0,0,.55)",
            zIndex: 9999,
            border: "1px solid rgba(255,255,255,.08)",
          }}
        >
          {/* Header user (avatar + nama) */}
          <div
            style={{
              padding: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <AvatarCircle user={user} size={44} />
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "white", fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>
                {user.username || "User"}
              </div>
              <div style={{ color: "rgba(255,255,255,.6)", fontSize: 13, marginTop: 4 }}>
                {user.email || "user@email.com"}
              </div>
            </div>
          </div>

          {/* Items */}
          <MenuItem
            active={isActiveProfile}
            icon={<IconUser />}
            text="Profil Saya"
            onClick={() => go("/profile")}
          />
          <MenuItem
            icon={<IconStar />}
            text="Ubah Premium"
            onClick={() => go("/subscribe")}
          />
          <MenuItem
            danger
            icon={<IconLogout />}
            text="Keluar"
            onClick={() => {
              logout();
              nav("/login", { replace: true });
            }}
          />
        </div>
      )}
    </div>
  );
}

/** ✅ Avatar yang konsisten:
 * - kalau ada user.avatar (base64 hasil upload) -> pakai itu
 * - kalau nggak -> huruf depan username/email (mockup style)
 */
function AvatarCircle({ user, size = 32 }) {
  const letter = String(user?.username || user?.email || "U")
    .trim()
    .charAt(0)
    .toUpperCase();

  const src = user?.avatar ? String(user.avatar) : "";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        overflow: "hidden",
        background: src ? "#111" : "#c61f3a", // merah kayak mockup kalau huruf
        display: "grid",
        placeItems: "center",
        flex: "0 0 auto",
        border: "1px solid rgba(255,255,255,.12)",
      }}
      title={user?.username || "User"}
    >
      {src ? (
        <img
          src={src}
          alt="avatar"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <span style={{ color: "white", fontWeight: 800, fontSize: Math.max(12, size * 0.42) }}>
          {letter}
        </span>
      )}
    </div>
  );
}

function MenuItem({ icon, text, onClick, danger, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        background: active ? "rgba(50,84,255,.22)" : "transparent", // biru aktif
        border: "none",
        padding: "14px 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 12,
        color: danger ? "#ff5b5b" : "white",
        fontWeight: 700,
        fontSize: 16,
        textAlign: "left",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "rgba(255,255,255,.06)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <span style={{ width: 22, display: "grid", placeItems: "center", opacity: danger ? 1 : 0.9 }}>
        {icon}
      </span>
      <span>{text}</span>
    </button>
  );
}

/* Icon kecil (tanpa library) */
function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="m12 17.27 5.18 3.11-1.64-5.81L20 10.24l-5.9-.5L12 4.5 9.9 9.74 4 10.24l4.46 4.33-1.64 5.81L12 17.27Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M10 17v-2h4v-6h-4V7l-5 5 5 5Zm9-13h-7v2h7v14h-7v2h7a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"
        fill="currentColor"
      />
    </svg>
  );
}
