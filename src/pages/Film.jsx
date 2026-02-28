// src/pages/Film.jsx
import { Container, Button, Badge } from "react-bootstrap";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell.jsx";
import DetailModal from "../components/media/DetailModal.jsx";
import PremiumModal from "../components/media/PremiumModal.jsx";
import PosterHoverGrid from "../components/media/PosterHoverGrid.jsx";
import { catalog } from "../data/catalog.js";

export default function Film() {
  const nav = useNavigate();

  const moviesAll = useMemo(() => catalog.filter((x) => x.type === "movie"), []);

  const hero = useMemo(() => {
    const withHero = moviesAll.find((x) => x.hero);
    return withHero || moviesAll[0] || catalog[0];
  }, [moviesAll]);

  const heroImg = hero?.hero || hero?.poster;

  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

  // fake mute (UI doang)
  const [muted, setMuted] = useState(true);

  // ===== GENRE FILTER =====
  const [genreOpen, setGenreOpen] = useState(false);
  const [activeGenre, setActiveGenre] = useState("Semua");
  const genreRef = useRef(null);

  const allGenres = useMemo(() => {
    const s = new Set();
    for (const it of moviesAll) {
      const arr = it.genres || (it.genre ? [it.genre] : []);
      for (const g of arr) s.add(String(g));
    }
    return ["Semua", ...Array.from(s).sort((a, b) => a.localeCompare(b))];
  }, [moviesAll]);

  const movies = useMemo(() => {
    if (activeGenre === "Semua") return moviesAll;
    return moviesAll.filter((it) => {
      const arr = it.genres || (it.genre ? [it.genre] : []);
      return arr.map(String).includes(activeGenre);
    });
  }, [moviesAll, activeGenre]);

  // close dropdown: klik luar + ESC
  useEffect(() => {
    const onDown = (e) => {
      if (!genreRef.current) return;
      if (!genreRef.current.contains(e.target)) setGenreOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setGenreOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const openItem = (it) => {
    setSelected(it);
    setShowDetail(true);
  };

  const goPlay = (it) => {
    if (it?.isPremium) return setShowPremium(true);
    nav(`/watch/film/${it.id}`);
  };

  return (
    <PageShell>
      {/* HERO */}
      <div className="border-bottom border-secondary">
        <div
          style={{
            position: "relative",
            minHeight: 420,
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.85), rgba(0,0,0,.35)), url('${heroImg}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* fake sound/mute (pojok kanan bawah) */}
          <button
            type="button"
            onClick={() => setMuted((v) => !v)}
            className="btn btn-dark"
            style={{
              position: "absolute",
              right: 18,
              bottom: 18,
              width: 44,
              height: 44,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.25)",
              background: "rgba(0,0,0,.35)",
              display: "grid",
              placeItems: "center",
              zIndex: 6,
            }}
            title={muted ? "Unmute (fake)" : "Mute (fake)"}
          >
            <i
              className={`bi ${muted ? "bi-volume-mute-fill" : "bi-volume-up-fill"}`}
              style={{ fontSize: 18, color: "#fff" }}
            />
          </button>

          <Container className="py-5">
            {/* ✅ GENRE DI HERO (SAMA PERSIS KAYA SERIES) */}
            <div
              ref={genreRef}
              style={{
                position: "relative",
                display: "inline-block",
                marginBottom: 18,
                zIndex: 7,
              }}
            >
              <Button
                variant="dark"
                className="border border-secondary"
                onClick={() => setGenreOpen((v) => !v)}
                style={{
                  borderRadius: 10,
                  padding: "6px 10px",
                  fontSize: 13,
                  background: "rgba(20,20,20,.55)", // ✅ samain
                  backdropFilter: "blur(6px)",
                }}
              >
                Genre <span className="ms-2">▾</span>
              </Button>

              {genreOpen && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "calc(100% + 10px)",
                    width: 420,
                    background: "#1f2429",
                    border: "1px solid rgba(255,255,255,.10)",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 18px 45px rgba(0,0,0,.55)",
                  }}
                >
                  <div
                    style={{
                      padding: 12,
                      fontWeight: 700,
                      borderBottom: "1px solid rgba(255,255,255,.08)",
                    }}
                  >
                    Genre
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      padding: 8,
                      gap: 0,
                    }}
                  >
                    {allGenres.map((g) => {
                      const active = activeGenre === g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            setActiveGenre(g);
                            setGenreOpen(false);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            background: active ? "rgba(50,84,255,.18)" : "transparent",
                            border: "none",
                            color: "#fff",
                            padding: "10px 12px",
                            borderRadius: 10,
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = active
                              ? "rgba(50,84,255,.18)"
                              : "rgba(255,255,255,.06)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = active
                              ? "rgba(50,84,255,.18)"
                              : "transparent";
                          }}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* badges */}
            <div className="d-flex gap-2 mb-2">
              {hero?.age && <Badge bg="secondary">{hero.age}</Badge>}
              {hero?.isPremium && (
                <Badge bg="warning" text="dark">
                  Premium
                </Badge>
              )}
              {hero?.isNew && <Badge bg="success">New</Badge>}
            </div>

            <h1 className="fw-bold">{hero?.title}</h1>
            <p className="text-secondary col-md-7">{hero?.description}</p>

            <div className="d-flex gap-2">
              <Button
                variant="primary"
                style={{ background: "#3254FF", borderColor: "#3254FF" }}
                onClick={() => goPlay(hero)}
              >
                Mulai
              </Button>
              <Button variant="outline-light" onClick={() => openItem(hero)}>
                Selengkapnya
              </Button>
            </div>
          </Container>
        </div>
      </div>

      <Container className="py-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h5 className="fw-semibold m-0">Halaman Film</h5>
            <div className="text-secondary small">
              Total: {movies.length}
              {activeGenre !== "Semua" ? ` • Filter: ${activeGenre}` : ""}
            </div>
          </div>
        </div>

        <PosterHoverGrid items={movies} onPlay={goPlay} onInfo={openItem} />
      </Container>

      <DetailModal
        show={showDetail}
        onHide={() => setShowDetail(false)}
        item={selected}
        onPlay={goPlay}
        onRequirePremium={() => setShowPremium(true)}
      />
      <PremiumModal show={showPremium} onHide={() => setShowPremium(false)} />
    </PageShell>
  );
}
