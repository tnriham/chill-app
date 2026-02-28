import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Button, Modal, Offcanvas, Badge, ProgressBar } from "react-bootstrap";
import PageShell from "../components/layout/PageShell.jsx";
import PremiumModal from "../components/media/PremiumModal.jsx";
import { catalog } from "../data/catalog.js";
import { isPremiumUser } from "../utils/premium.js";

export default function WatchFilm() {
  const nav = useNavigate();
  const { id } = useParams();

  const item = useMemo(
    () => catalog.find((x) => String(x.id) === String(id)),
    [id]
  );

  const [showPremium, setShowPremium] = useState(false);

  // fake player state
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(18);

  // popups
  const [subtitle, setSubtitle] = useState("Indonesia");
  const [speed, setSpeed] = useState(1);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [showEpisode, setShowEpisode] = useState(false);

  // “chapter” dummy
  const chapters = [
    { no: 1, title: "Pembuka", dur: "03:12", pct: 10 },
    { no: 2, title: "Konflik", dur: "11:48", pct: 35 },
    { no: 3, title: "Puncak Cerita", dur: "19:05", pct: 62 },
    { no: 4, title: "Akhir", dur: "08:40", pct: 88 },
  ];

  useEffect(() => {
    if (!item) return;
    if (item.isPremium && !isPremiumUser()) setShowPremium(true);
  }, [item]);

  if (!item) {
    return (
      <PageShell>
        <Container className="py-4 text-white">
          <div className="fw-bold">Film tidak ditemukan.</div>
          <Button className="mt-3" variant="outline-light" onClick={() => nav("/film")}>
            Kembali ke Film
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
                // kalau premium belum subscribe, jangan allow play
                if (item.isPremium && !isPremiumUser()) {
                  setShowPremium(true);
                  return;
                }
                setPlaying((p) => !p);
                setProgress((p) => (p < 95 ? p + 6 : p)); // biar keliatan “jalan”
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
                00:{String(progress).padStart(2, "0")} / 01:45:00
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
              </div>
            </div>
          </div>
        </div>
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

      {/* Episode/chapter offcanvas */}
      <Offcanvas show={showEpisode} onHide={() => setShowEpisode(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Daftar Episode</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="text-secondary small mb-2">
            Untuk Film, ini dianggap “chapter” supaya UI sesuai desain.
          </div>

          {chapters.map((c) => (
            <div
              key={c.no}
              className="p-3 mb-2 border rounded-3"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setProgress(c.pct);
                setShowEpisode(false);
              }}
            >
              <div className="fw-bold">
                Chapter {c.no}: {c.title}
              </div>
              <div className="text-secondary small">{c.dur}</div>
            </div>
          ))}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Premium modal */}
      <PremiumModal show={showPremium} onHide={() => setShowPremium(false)} />
    </PageShell>
  );
}
