import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell.jsx";
import { setSubscription } from "../data/subscription.js";

const benefits = [
  { icon: "bi-download", title: "Download Konten", sub: "Pilihan" },
  { icon: "bi-badge-ad", title: "Tidak Ada Iklan", sub: "" },
  { icon: "bi-film", title: "Tonton Semua Konten", sub: "" },
  { icon: "bi-badge-4k", title: "Kualitas Maksimal", sub: "Sampai Dengan 4K" },
  { icon: "bi-display", title: "Tonton di TV, Tablet,", sub: "Mobile, dan Laptop" },
  { icon: "bi-badge-cc", title: "Subtitle Untuk Konten", sub: "Pilihan" },
];

const plans = [
  {
    key: "individu",
    name: "Individu",
    price: 49990,
    label: "Mulai dari Rp 49.990 / bulan",
    accounts: "1 Akun",
    perks: ["Tidak ada iklan", "Kualitas 4K", "Download konten pilihan"],
    tag: "Best",
  },
  {
    key: "berdua",
    name: "Berdua",
    price: 79990,
    label: "Mulai dari Rp 79.990 / bulan",
    accounts: "2 Akun",
    perks: ["Tidak ada iklan", "Kualitas 4K", "Download konten pilihan"],
    tag: "Populer",
  },
  {
    key: "keluarga",
    name: "Keluarga",
    price: 139990,
    label: "Mulai dari Rp 139.990 / bulan",
    accounts: "5–7 Akun",
    perks: ["Tidak ada iklan", "Kualitas 4K", "Download konten pilihan"],
    tag: "Hemat",
  },
];

export default function Subscribe() {
  const nav = useNavigate();

  const choosePlan = (plan) => {
    setSubscription({
      planKey: plan.key,
      planName: plan.name,
      price: plan.price,
      accounts: plan.accounts,
      isSubscribed: false, // jadi true setelah bayar
    });
    nav("/payment");
  };

  return (
    <PageShell>
      <Container className="py-5">
        {/* ===== BENEFIT ===== */}
        <div className="text-center mb-4">
          <h3 className="fw-bold text-white">Kenapa Harus Berlangganan?</h3>
        </div>

        <Row className="g-3 justify-content-center mb-5">
          {benefits.map((b) => (
            <Col key={b.title} xs={6} md={4} lg={2}>
              <div className="text-center">
                <div
                  className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <i className={`bi ${b.icon}`} style={{ fontSize: 22 }} />
                </div>
                <div className="fw-semibold text-white small">{b.title}</div>
                {b.sub && (
                  <div className="text-secondary small">{b.sub}</div>
                )}
              </div>
            </Col>
          ))}
        </Row>

        {/* ===== PLANS ===== */}
        <div className="text-center mb-3">
          <h4 className="fw-bold text-white">Pilih Paketmu</h4>
          <div className="text-secondary">
            Temukan paket sesuai kebutuhanmu!
          </div>
        </div>

        <Row className="g-3 justify-content-center">
          {plans.map((p) => (
            <Col key={p.key} xs={12} md={6} lg={4}>
              <Card
                className="border-0 h-100"
                style={{
                  background: "#2b3bff",
                  borderRadius: 18,
                }}
              >
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="fw-bold text-white">{p.name}</div>
                    <Badge bg="light" text="dark">
                      {p.tag}
                    </Badge>
                  </div>

                  <div className="text-white small">{p.label}</div>
                  <div className="text-white small mt-1">{p.accounts}</div>

                  <div className="mt-3">
                    {p.perks.map((perk) => (
                      <div
                        key={perk}
                        className="d-flex align-items-center gap-2 mb-2 text-white small"
                      >
                        <i className="bi bi-check-circle-fill" />
                        {perk}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-3">
                    <Button
                      variant="light"
                      className="w-100 fw-bold"
                      style={{ borderRadius: 12 }}
                      onClick={() => choosePlan(p)}
                    >
                      Langganan
                    </Button>
                    <div className="text-white small mt-2 opacity-75">
                      Syarat dan ketentuan berlaku
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </PageShell>
  );
}
