import { useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell.jsx";
import { getSubscription, setSubscription } from "../data/subscription.js";

function rupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatIDDate(date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

const paymentMethods = [
  { group: "Virtual Account", items: ["BCA Virtual Account", "BRI Virtual Account", "BNI Virtual Account", "Mandiri Virtual Account"] },
  { group: "E-Wallet", items: ["GoPay", "OVO", "DANA", "ShopeePay"] },
  { group: "Kartu", items: ["Kartu Kredit / Debit"] },
];

export default function Payment() {
  const nav = useNavigate();

  const sub = getSubscription();

  const plan = useMemo(() => {
    // fallback kalau user masuk payment tanpa pilih paket
    if (!sub) {
      return { planName: "Individu", price: 49990, accounts: "1 Akun" };
    }
    return {
      planName: sub.planName || "Individu",
      price: Number(sub.price) || 49990,
      accounts: sub.accounts || "1 Akun",
    };
  }, [sub]);

  const [method, setMethod] = useState("BCA Virtual Account");
  const [agree, setAgree] = useState(true);
  const [err, setErr] = useState("");

  const adminFee = 2000;
  const total = plan.price + adminFee;

  const payNow = () => {
    setErr("");

    if (!agree) {
      setErr("Centang persetujuan syarat & ketentuan dulu ya.");
      return;
    }

    // “Sukses” (UI simulation)
    const until = formatIDDate(addDays(new Date(), 30)); // aktif 30 hari

    setSubscription({
      ...(sub || {}),
      planName: plan.planName,
      price: plan.price,
      accounts: plan.accounts,
      method,
      isSubscribed: true,
      until,
      paidAt: new Date().toISOString(),
    });

    nav("/profile");
  };

  return (
    <PageShell>
      <Container className="py-4">
        <div className="mb-3">
          <h3 className="fw-bold text-white mb-1">Pembayaran</h3>
          <div className="text-secondary">
            Selesaikan pembayaran untuk mengaktifkan langganan Premium.
          </div>
        </div>

        <Row className="g-4">
          {/* LEFT: Plan summary */}
          <Col lg={4}>
            <Card className="border-0" style={{ background: "#2b3bff", borderRadius: 18 }}>
              <Card.Body>
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <div className="fw-bold text-white">Paket {plan.planName}</div>
                    <div className="text-white small" style={{ opacity: 0.9 }}>
                      {plan.accounts}
                    </div>
                  </div>
                  <Badge bg="light" text="dark">
                    Dipilih
                  </Badge>
                </div>

                <div className="mt-3 text-white small" style={{ opacity: 0.95 }}>
                  <div className="d-flex gap-2 align-items-center mb-2">
                    <i className="bi bi-check-circle-fill" />
                    <span>Tidak ada iklan</span>
                  </div>
                  <div className="d-flex gap-2 align-items-center mb-2">
                    <i className="bi bi-check-circle-fill" />
                    <span>Kualitas sampai 4K</span>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <i className="bi bi-check-circle-fill" />
                    <span>Download konten pilihan</span>
                  </div>
                </div>

                <Button
                  variant="light"
                  className="w-100 mt-3 fw-bold"
                  style={{ borderRadius: 12 }}
                  onClick={() => nav("/subscribe")}
                >
                  Ganti Paket
                </Button>

                <div className="text-white small mt-2" style={{ opacity: 0.85 }}>
                  * Ini UI simulation untuk tugas.
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* RIGHT: Payment */}
          <Col lg={8}>
            <Card bg="dark" text="white" className="border-secondary" style={{ borderRadius: 18 }}>
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <div className="fw-bold">Ringkasan Pembayaran</div>
                    <div className="text-secondary small">
                      Pilih metode pembayaran dan cek detail transaksi.
                    </div>
                  </div>
                  <Button variant="outline-light" size="sm" onClick={() => nav(-1)}>
                    Kembali
                  </Button>
                </div>

                <Row className="g-3">
                  {/* Method select */}
                  <Col md={7}>
                    <Card className="border-secondary" style={{ background: "#1b1b1b", borderRadius: 16 }}>
                      <Card.Body>
                        <div className="fw-semibold mb-2">Metode Pembayaran</div>

                        <Form.Select
                          className="bg-dark text-white border-secondary"
                          value={method}
                          onChange={(e) => setMethod(e.target.value)}
                        >
                          {paymentMethods.map((g) => (
                            <optgroup key={g.group} label={g.group}>
                              {g.items.map((it) => (
                                <option key={it} value={it}>
                                  {it}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </Form.Select>

                        <div className="text-secondary small mt-2">
                          Metode dipilih: <span className="text-white">{method}</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Detail */}
                  <Col md={5}>
                    <Card className="border-secondary" style={{ background: "#1b1b1b", borderRadius: 16 }}>
                      <Card.Body>
                        <div className="fw-semibold mb-2">Detail</div>

                        <div className="d-flex justify-content-between text-secondary">
                          <span>Paket {plan.planName}</span>
                          <span className="text-white">{rupiah(plan.price)}</span>
                        </div>

                        <div className="d-flex justify-content-between text-secondary mt-2">
                          <span>Biaya Admin</span>
                          <span className="text-white">{rupiah(adminFee)}</span>
                        </div>

                        <hr className="border-secondary my-3" />

                        <div className="d-flex justify-content-between">
                          <span className="fw-bold">Total</span>
                          <span className="fw-bold">{rupiah(total)}</span>
                        </div>

                        <Form.Check
                          className="mt-3"
                          type="checkbox"
                          checked={agree}
                          onChange={(e) => setAgree(e.target.checked)}
                          label={
                            <span className="text-secondary small">
                              Saya setuju dengan syarat & ketentuan.
                            </span>
                          }
                        />

                        {err ? (
                          <Alert variant="danger" className="mt-3 mb-0">
                            {err}
                          </Alert>
                        ) : null}

                        <Button
                          className="w-100 mt-3 fw-bold"
                          variant="primary"
                          style={{ background: "#3254FF", borderColor: "#3254FF", borderRadius: 12 }}
                          onClick={payNow}
                        >
                          Bayar
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </PageShell>
  );
}
