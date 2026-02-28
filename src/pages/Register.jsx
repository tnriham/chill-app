import { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/layout/AuthShell.jsx";
import bg from "../assets/bg-auth.jpg";
import PageShell from "../components/layout/PageShell.jsx";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");

    if (!email || !password) {
      setErr("Semua field wajib diisi.");
      return;
    }

    if (password !== confirm) {
      setErr("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    // simulasi daftar sukses
    nav("/login");
  };

  return (
    <PageShell hideNavbar hideFooter>
      <AuthShell bg={bg}>
        <div className="text-center">
          <div className="auth-brand">CHILL</div>
        </div>

        <div className="auth-title">Daftar</div>
        <div className="auth-subtitle">Buat akun baru</div>

        {err && (
          <Alert variant="danger" className="py-2">
            {err}
          </Alert>
        )}

        <Form onSubmit={onSubmit} className="d-grid gap-3">
          <Form.Group>
            <Form.Label className="text-secondary">Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className="text-secondary">Kata Sandi</Form.Label>
            <Form.Control
              type="password"
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className="text-secondary">
              Konfirmasi Kata Sandi
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Ulangi kata sandi"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>

          <Button type="submit" className="btn-chill py-2">
            Daftar
          </Button>

          <div className="auth-divider">
            <span>Atau</span>
          </div>

          <Button
            type="button"
            variant="outline-light"
            className="py-2 fw-semibold"
            onClick={() => alert("Simulasi: daftar google")}
          >
            <i className="bi bi-google me-2" />
            Daftar dengan Google
          </Button>

          <div className="text-center text-secondary small mt-2">
            Sudah punya akun?{" "}
            <Link to="/login" className="auth-link">
              Masuk
            </Link>
          </div>

          <div className="auth-hint">* simulasi daftar</div>
        </Form>
      </AuthShell>
    </PageShell>
  );
}