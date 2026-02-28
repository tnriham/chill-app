import { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/layout/AuthShell.jsx";
import bg from "../assets/bg-auth.jpg";
import { login } from "../utils/auth.js";
import PageShell from "../components/layout/PageShell.jsx";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");

    const res = login({ email, password });
    if (!res.ok) {
      setErr(res.message || "Gagal login.");
      return;
    }

    nav("/", { replace: true });
  };

  return (
    <PageShell hideNavbar hideFooter>
      <AuthShell bg={bg}>
        <div className="text-center">
          <div className="auth-brand">CHILL</div>
        </div>

        <div className="auth-title">Masuk</div>
        <div className="auth-subtitle">Selamat datang kembali!</div>

        {err && (
          <Alert variant="danger" className="py-2">
            {err}
          </Alert>
        )}

        <Form onSubmit={onSubmit} className="d-grid gap-3">
          <Form.Group>
            <Form.Label className="text-secondary">Email</Form.Label>
            <Form.Control
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Masukkan email"
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>

          <Form.Group>
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label className="text-secondary m-0">
                Kata Sandi
              </Form.Label>
              <button
                type="button"
                className="p-0 border-0 bg-transparent text-secondary small"
                onClick={() => alert("Simulasi: lupa kata sandi")}
              >
                Lupa kata sandi?
              </button>
            </div>

            <Form.Control
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Masukkan kata sandi"
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>

          <Button type="submit" className="btn-chill py-2">
            Masuk
          </Button>

          <div className="auth-divider">
            <span>Atau</span>
          </div>

          <Button
            type="button"
            variant="outline-light"
            className="py-2 fw-semibold"
            onClick={() => alert("Simulasi: login google")}
          >
            <i className="bi bi-google me-2" />
            Masuk dengan Google
          </Button>

          <div className="text-center text-secondary small mt-2">
            Belum punya akun?{" "}
            <Link to="/register" className="auth-link">
              Daftar
            </Link>
          </div>

          <div className="auth-hint">* simulasi login</div>
        </Form>
      </AuthShell>
    </PageShell>
  );
}