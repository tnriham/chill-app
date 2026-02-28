import { useEffect, useMemo, useState } from "react";
import { Dropdown } from "react-bootstrap";

const KEY = "chill_profile_mode"; // "kids" | "adult"

export default function ProfileSwitcher() {
  const [mode, setMode] = useState("kids");

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "adult" || saved === "kids") setMode(saved);
  }, []);

  const label = useMemo(() => (mode === "kids" ? "Kids" : "Dewasa"), [mode]);
  const emoji = useMemo(() => (mode === "kids" ? "🧒" : "👤"), [mode]);

  const selectMode = (next) => {
    setMode(next);
    localStorage.setItem(KEY, next);

    // optional: kalau mau efek langsung (misal ganti tema/ filter konten),
    // kamu bisa trigger refresh kecil:
    // window.location.reload();
  };

  return (
    <>
      <Dropdown align="end">
        <Dropdown.Toggle
          variant="outline-light"
          className="profile-pill"
          style={{
            borderRadius: 999,
            padding: "10px 16px",
            borderColor: "rgba(255,255,255,.35)",
            background: "rgba(0,0,0,.25)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 700,
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{emoji}</span>
          <span>{label}</span>
          <span style={{ opacity: 0.9 }}>▾</span>
        </Dropdown.Toggle>

        <Dropdown.Menu
          variant="dark"
          style={{
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,.12)",
          }}
        >
          <Dropdown.Item
            active={mode === "kids"}
            onClick={() => selectMode("kids")}
            style={{ padding: "10px 14px" }}
          >
            🧒 Kids
          </Dropdown.Item>
          <Dropdown.Item
            active={mode === "adult"}
            onClick={() => selectMode("adult")}
            style={{ padding: "10px 14px" }}
          >
            👤 Dewasa
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* hover glow kecil biar mirip mockup */}
      <style>{`
        .profile-pill:hover{
          border-color: rgba(255,255,255,.6) !important;
          background: rgba(255,255,255,.06) !important;
        }
      `}</style>
    </>
  );
}
