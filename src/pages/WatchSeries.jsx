import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Button, Modal, Offcanvas, Badge, ProgressBar, Card } from "react-bootstrap";
import PageShell from "../components/layout/PageShell.jsx";
import PremiumModal from "../components/media/PremiumModal.jsx";
import { catalog } from "../data/catalog.js";
import { isPremiumUser } from "../utils/premium.js";

export default function WatchSeries() {
  const nav = useNavigate();
  const { id } = useParams();

  const item = useMemo(
    () => catalog.find((x) => String(x.id) === String(id)),
    [id]
  );

  const episodes = item?.episodes || [];

  const [showPremium, setShowPremium] = useState(false);

  // current episode
  const [currentEp, setCurrentEp] = useState(null);

  // fake player state
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(10);

  // popups
  const [subtitle, setSubtitle] = useState("Indonesia");
  const [speed, setSpeed] = useState(1);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [showEpisode, setShowEpisode] = useState(false);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    if (!item) return;
    if (item.isPremium && !isPremiumUser()) setShowPremium(true);
  }, [item]);

  useEffect(() => {
    if (!currentEp && episodes.length > 0) setCurrentEp(episodes[0]);
  }, [episodes, currentEp]);

  const nextEp = useMemo(() => {
    if (!currentEp) return null;
    const idx = episodes.findIndex((e) => e.id === currentEp.id);
    if (idx < 0) return null;
    return episodes[idx + 1] || null;
  }, [currentEp, episodes]);

  if (!item) {
    return (
      <PageShell>
        <Container className="py-4 text-white">
          <div className="fw-bold">Series tidak ditemukan.</div>
          <Button className="mt-3" variant="outline-light" onClick={() => nav("/series")}>
            Kembali ke Series
          </Button>
        </Container>
      </PageShell>
    );
  }

  const heroImg = item.hero || item.poster;

  return (
    <PageShell>
      <Container className="py-3">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <div className="fw-bold text-white">{item.title}</div>
            <div className="text-secondary small">
              {item.year || "2023"} • {item.genre || "Action"} • {item.age || "13+"}
            </div>
          </div>

          <div className="d-flex gap-2 align-items-center">
            {item.isPremium && (
              <Badge bg="warning" text="dark">
                Premium
              </Badge>
            )}
            <Button size="sm" variant="outline-light" onClick={() => nav(-1)}>
              Kembali
            </Button>
          </div>
        </div>

        <div className="text-secondary small mb-2">
          {currentEp ? (
            <>
              Sedang menonton:{" "}
              <span className="text-white">
                Ep {currentEp.no} - {currentEp.title}
              </span>
            </>
          ) : (
            "Tidak ada episode."
          )}
        </div>

        {/* Fake Player */}
        <div
          className="position-relative border border-secondary"
          style={{ borderRadius: 16, overflow: "hidden", background: "#000" }}
        >
          <img src={heroImg} alt={item.title} style={{ width: "100%", display: "block" }} />

          {/* overlay */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,.72), rgba(0,0,0,0))",
            }}
          />

          {/* play button */}
          <div className="position-absolute top-50 start-50 translate-middle">
            <Button
              variant="light"
              style={{ width: 64, height: 64, borderRadius: "50%", fontSize: 24 }}
              onClick={() => {
                if (item.isPremium && !isPremiumUser()) {
                  setShowPremium(true);
                  return;
                }
                setPlaying((p) => !p);
                setProgress((p) => (p < 95 ? p + 6 : p));
              }}
            >
              {playing ? "⏸" : "▶"}
            </Button>
          </div>

          {/* bottom controls */}
          <div className="position-absolute bottom-0 w-100 p-3">
            <ProgressBar now={progress} style={{ height: 6 }} className="mb-2" />

            <div className="d-flex justify-content-between align-items-center">
              <div className="text-white small">
                00:{String(progress).padStart(2, "0")} / {currentEp?.duration || "00m"}
              </div>

              <div className="d-flex gap-2">
                <Button size="sm" variant="outline-light" onClick={() => setShowSubtitle(true)}>
                  Subtitle
                </Button>
                <Button size="sm" variant="outline-light" onClick={() => setShowSpeed(true)}>
                  {speed}x
                </Button>
                <Button size="sm" variant="outline-light" onClick={() => setShowEpisode(true)}>
                  Episode
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  style={{ background: "#3254FF", borderColor: "#3254FF" }}
                  disabled={!nextEp}
                  onClick={() => setShowNext(true)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Next preview card */}
        {nextEp && (
          <Card bg="dark" text="white" className="border-secondary mt-3" style={{ borderRadius: 16 }}>
            <Card.Body className="d-flex align-items-center justify-content-between gap-3">
              <div className="d-flex gap-3 align-items-center">
                <img
                  src={nextEp.thumb || item.poster}
                  alt={nextEp.title}
                  style={{ width: 96, height: 54, objectFit: "cover", borderRadius: 10 }}
                />
                <div>
                  <div className="fw-semibold">
                    Selanjutnya: Ep {nextEp.no} - {nextEp.title}
                  </div>
                  <div className="text-secondary small">{nextEp.duration}</div>
                </div>
              </div>
              <Button variant="outline-light" onClick={() => setShowNext(true)}>
                Lanjutkan
              </Button>
            </Card.Body>
          </Card>
        )}
      </Container>

      {/* Subtitle popup */}
      <Modal show={showSubtitle} onHide={() => setShowSubtitle(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Subtitle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {["Indonesia", "English", "Off"].map((opt) => (
            <Button
              key={opt}
              className="w-100 mb-2"
              variant={subtitle === opt ? "primary" : "outline-secondary"}
              style={subtitle === opt ? { background: "#3254FF", borderColor: "#3254FF" } : {}}
              onClick={() => {
                setSubtitle(opt);
                setShowSubtitle(false);
              }}
            >
              {opt}
            </Button>
          ))}
        </Modal.Body>
      </Modal>

      {/* Speed popup */}
      <Modal show={showSpeed} onHide={() => setShowSpeed(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Kecepatan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {[0.5, 1, 1.25, 1.5, 2].map((opt) => (
            <Button
              key={opt}
              className="w-100 mb-2"
              variant={speed === opt ? "primary" : "outline-secondary"}
              style={speed === opt ? { background: "#3254FF", borderColor: "#3254FF" } : {}}
              onClick={() => {
                setSpeed(opt);
                setShowSpeed(false);
              }}
            >
              {opt}x
            </Button>
          ))}
        </Modal.Body>
      </Modal>

      {/* Episode offcanvas */}
      <Offcanvas show={showEpisode} onHide={() => setShowEpisode(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Daftar Episode</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {episodes.length === 0 ? (
            <div className="text-secondary">Episode belum ada di data.</div>
          ) : (
            episodes.map((ep) => {
              const active = currentEp?.id === ep.id;
              return (
                <div
                  key={ep.id}
                  className="d-flex gap-3 p-2 mb-2 border rounded-3"
                  style={{
                    cursor: "pointer",
                    borderColor: active ? "rgba(50,84,255,.6)" : "#ddd",
                    background: active ? "rgba(50,84,255,.08)" : "transparent",
                  }}
                  onClick={() => {
                    setCurrentEp(ep);
                    setProgress(8);
                    setShowEpisode(false);
                  }}
                >
                  <img
                    src={ep.thumb || item.poster}
                    alt={ep.title}
                    style={{ width: 96, height: 54, objectFit: "cover", borderRadius: 10 }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">
                      Ep {ep.no} • {ep.title}
                    </div>
                    <div className="text-secondary small">{ep.duration}</div>
                    {ep.desc ? <div className="text-secondary small">{ep.desc}</div> : null}
                  </div>
                </div>
              );
            })
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Next episode popup */}
      <Modal show={showNext} onHide={() => setShowNext(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Lanjut Episode Selanjutnya?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!nextEp ? (
            <div className="text-secondary">Tidak ada episode berikutnya.</div>
          ) : (
            <>
              <div className="d-flex gap-3">
                <img
                  src={nextEp.thumb || item.poster}
                  alt={nextEp.title}
                  style={{ width: 120, height: 68, objectFit: "cover", borderRadius: 12 }}
                />
                <div>
                  <div className="fw-bold">
                    Ep {nextEp.no} - {nextEp.title}
                  </div>
                  <div className="text-secondary small">{nextEp.duration}</div>
                </div>
              </div>

              <div className="d-flex gap-2 mt-3">
                <Button
                  variant="primary"
                  style={{ background: "#3254FF", borderColor: "#3254FF" }}
                  onClick={() => {
                    setCurrentEp(nextEp);
                    setProgress(6);
                    setShowNext(false);
                  }}
                >
                  Lanjut
                </Button>
                <Button variant="outline-secondary" onClick={() => setShowNext(false)}>
                  Nanti
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Premium modal */}
      <PremiumModal show={showPremium} onHide={() => setShowPremium(false)} />
    </PageShell>
  );
}
