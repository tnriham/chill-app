// src/pages/Profile.jsx
import { useMemo, useRef, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell.jsx";
import { catalog } from "../data/catalog.js";
import { getCurrentUser, logout, updateCurrentUser } from "../utils/auth.js";
import { getInitial, stringToColor } from "../utils/avatar.js";

export default function Profile() {
  const nav = useNavigate();
  const fileRef = useRef(null);

  const [user, setUser] = useState(
    () => getCurrentUser() || { username: "User", email: "user@email.com", avatar: "" }
  );

  // premium flag kamu
  const isPremium = localStorage.getItem("chill_premium") === "true";

  // daftar saya (mockup)
  const myList = useMemo(() => catalog.filter((x) => x.isSaved).slice(0, 12), []);

  // form state
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");

  const handleLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  const handleSaveProfile = () => {
    const nextUsername = username.trim();
    const nextEmail = email.trim().toLowerCase();

    if (!nextUsername || !nextEmail) {
      alert("Username dan email wajib diisi.");
      return;
    }

    const res = updateCurrentUser({
      username: nextUsername,
      email: nextEmail,
    });

    if (res.ok) {
      setUser(res.user);
      alert("Profil tersimpan.");
    } else {
      alert(res.message || "Gagal menyimpan.");
    }
  };

  const handlePickAvatar = () => fileRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus gambar ya.");
      return;
    }

    const maxMB = 1.5;
    if (file.size > maxMB * 1024 * 1024) {
      alert(`File kebesaran. Maks ${maxMB}MB`);
      return;
    }

    const base64 = await toDataUrl(file);
    const res = updateCurrentUser({ avatar: base64 });
    if (res.ok) setUser(res.user);

    // reset input biar bisa upload file yg sama lagi
    e.target.value = "";
  };

  // Avatar logic: kalau ada foto, pakai foto. kalau tidak, pakai initial + warna unik per akun
  const initial = getInitial(user.username);
  const avatarBg = stringToColor(user.email || user.username);

  return (
    <PageShell>
      <Container className="py-4 text-white">
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold mb-1">Profil Saya</h2>
          <div className="text-secondary">Kelola akun & langganan</div>
        </div>

        <Row className="g-3">
          {/* LEFT */}
          <Col lg={8}>
            {/* Card Profile */}
            <Card bg="dark" text="white" className="border-secondary" style={{ borderRadius: 16 }}>
              <Card.Body className="d-flex gap-3 align-items-center">
                {/* Avatar */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 999,
                    overflow: "hidden",
                    background: user.avatar ? "rgba(255,255,255,.08)" : avatarBg,
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid rgba(255,255,255,.14)",
                    flexShrink: 0,
                  }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ fontWeight: 900, fontSize: 22, color: "white" }}>{initial}</div>
                  )}
                </div>

                <div className="flex-grow-1">
                  <div className="fw-semibold" style={{ fontSize: 18 }}>
                    {user.username || "User"}
                  </div>
                  <div className="text-secondary">{user.email || "user@email.com"}</div>

                  <div className="mt-2 d-flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline-light"
                      onClick={handlePickAvatar}
                      style={{ borderRadius: 999 }}
                    >
                      Ubah Foto
                    </Button>

                    {user.avatar ? (
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        style={{ borderRadius: 999 }}
                        onClick={() => {
                          const res = updateCurrentUser({ avatar: "" });
                          if (res.ok) setUser(res.user);
                        }}
                      >
                        Hapus Foto
                      </Button>
                    ) : null}

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Form Akun */}
            <Card bg="dark" text="white" className="border-secondary mt-3" style={{ borderRadius: 16 }}>
              <Card.Body>
                <div className="fw-semibold mb-3">Akun</div>

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Nama Pengguna</Form.Label>
                    <Form.Control
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nama pengguna"
                      className="bg-dark text-white border-secondary"
                      style={{ borderRadius: 12 }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Email</Form.Label>
                    <Form.Control
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="bg-dark text-white border-secondary"
                      style={{ borderRadius: 12 }}
                    />
                    <div className="text-secondary small mt-1">
                      * Kalau email diganti, akun current user akan ikut ter-update.
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Kata Sandi</Form.Label>
                    <Form.Control
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      type="password"
                      className="bg-dark text-white border-secondary"
                      style={{ borderRadius: 12 }}
                    />
                    <div className="text-secondary small mt-1">
                      * Ini simulasi UI (password belum disimpan beneran).
                    </div>
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button
                      variant="primary"
                      style={{ background: "#3254FF", borderColor: "#3254FF", borderRadius: 999 }}
                      onClick={handleSaveProfile}
                    >
                      Simpan
                    </Button>

                    <Button variant="outline-light" style={{ borderRadius: 999 }} onClick={handleLogout}>
                      Keluar
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Daftar Saya */}
            <Card bg="dark" text="white" className="border-secondary mt-3" style={{ borderRadius: 16 }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="fw-semibold">Daftar Saya</div>
                  <Button
                    size="sm"
                    variant="outline-light"
                    style={{ borderRadius: 999 }}
                    onClick={() => nav("/my-list")}
                  >
                    Lihat Semua
                  </Button>
                </div>

                <div className="d-flex gap-3 overflow-auto pb-2">
                  {myList.map((it) => (
                    <button
                      key={it.id}
                      className="border border-secondary bg-dark p-0"
                      style={{ borderRadius: 12, overflow: "hidden", minWidth: 140 }}
                      onClick={() => {
                        const path = it.type === "movie" ? `/watch/film/${it.id}` : `/watch/series/${it.id}`;
                        nav(path);
                      }}
                    >
                      <div style={{ width: 140, height: 200 }}>
                        <img
                          src={it.poster}
                          alt={it.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* RIGHT */}
          <Col lg={4}>
            <Card bg="dark" text="white" className="border-secondary" style={{ borderRadius: 16 }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold">Berlangganan</div>
                    <div className="text-secondary small">
                      {isPremium ? "Kamu sudah Premium." : "Saat ini kamu belum berlangganan."}
                    </div>
                  </div>

                  {isPremium ? (
                    <Badge bg="warning" text="dark">
                      Premium
                    </Badge>
                  ) : (
                    <Badge bg="secondary">Basic</Badge>
                  )}
                </div>

                <div className="mt-3">
                  <Button
                    className="w-100"
                    variant={isPremium ? "outline-light" : "primary"}
                    style={
                      isPremium
                        ? { borderRadius: 999 }
                        : { background: "#3254FF", borderColor: "#3254FF", borderRadius: 999 }
                    }
                    onClick={() => nav("/subscribe")}
                  >
                    {isPremium ? "Kelola Paket" : "Mulai Berlangganan"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </PageShell>
  );
}

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
