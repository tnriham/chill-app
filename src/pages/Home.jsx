import { Container, Button, Badge, Carousel } from "react-bootstrap";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell.jsx";
import DetailModal from "../components/media/DetailModal.jsx";
import PremiumModal from "../components/media/PremiumModal.jsx";
import { catalog, continueWatching } from "../data/catalog.js";
import PosterHoverCard from "../components/media/PosterHoverCard.jsx";

export default function Home() {
  const nav = useNavigate();

  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

  // fake mute buat UI doang (mockup)
  const [muted, setMuted] = useState(true);

  // CRUD UI toggle (DISembunyiin - Ctrl+M)
  const [showCrud, setShowCrud] = useState(false);

  // ===== NORMALIZER: catalog lo ga punya rating, jadi kita generate rating stabil =====
  const normalizeItem = (x) => {
    const parsed = Number.parseFloat(String(x?.rating ?? "").replace(",", "."));

    // rating otomatis berbasis year + premium (hasilnya beda-beda tapi stabil)
    const year = Number(x?.year) || 2020;
    const base = 6.8 + Math.min(2.0, Math.max(0, (year - 2000) / 20)); // 6.8 - 8.8
    const bump = x?.isPremium ? 0.4 : 0;
    const fallbackRating = Math.min(9.5, Math.round((base + bump) * 10) / 10);

    return {
      ...x,
      type: x?.type === "movie" || x?.type === "series" ? x.type : "movie",
      rating: Number.isFinite(parsed) ? parsed : fallbackRating,
    };
  };

  // ===== CRUD STATE (WAJIB ARRAY OBJECT) =====
  const [homeData, setHomeData] = useState(() => catalog.map(normalizeItem));

  // form state (CREATE/UPDATE)
  const [form, setForm] = useState({
    title: "",
    type: "movie",
    rating: 8.0,
  });

  // edit mode
  const [editId, setEditId] = useState(null);

  // Shortcut Ctrl+M (toggle CRUD)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        setShowCrud((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // progress map untuk "Melanjutkan Tonton"
  const continueMap = useMemo(() => {
    const m = {};
    for (const x of continueWatching) m[x.id] = x.progress;
    return m;
  }, []);

  const openItem = (it) => {
    setSelected(it);
    setShowDetail(true);
  };

  const goPlay = (it) => {
    if (it.isPremium) return setShowPremium(true);
    const path =
      it.type === "movie" ? `/watch/film/${it.id}` : `/watch/series/${it.id}`;
    nav(path);
  };

  // ===== CRUD: CREATE =====
  const handleAdd = (e) => {
    e.preventDefault();

    const fallbackPoster =
      catalog?.find((x) => x.poster)?.poster ||
      "https://via.placeholder.com/400x600?text=Poster";

    const r = Number.parseFloat(String(form.rating ?? "").replace(",", "."));

    const newItem = normalizeItem({
      id: `custom-${Date.now()}`,
      title: form.title.trim(),
      type: form.type,
      rating: Number.isFinite(r) ? r : 8.0,
      poster: fallbackPoster,
      isPremium: false,
      isNew: true,
      isTrending: false,
      description: "Data baru dari Manage (CRUD).",
      age: "13+",
      genres: ["Custom"],
      year: new Date().getFullYear(),
    });

    setHomeData((prev) => [newItem, ...prev]);
    setForm({ title: "", type: "movie", rating: 8.0 });
  };

  // ===== CRUD: DELETE =====
  const handleDelete = (id) => {
    setHomeData((prev) => prev.filter((item) => item.id !== id));
    if (editId === id) {
      setEditId(null);
      setForm({ title: "", type: "movie", rating: 8.0 });
    }
  };

  // ===== CRUD: START EDIT =====
  const handleEditStart = (item) => {
    setEditId(item.id);
    setForm({
      title: item?.title ?? "",
      type:
        item?.type === "movie" || item?.type === "series" ? item.type : "movie",
      rating: Number.isFinite(Number(item?.rating)) ? Number(item.rating) : 8.0,
    });
  };

  // ===== CRUD: UPDATE =====
  const handleUpdate = (e) => {
    e.preventDefault();

    const r = Number.parseFloat(String(form.rating ?? "").replace(",", "."));

    setHomeData((prev) =>
      prev.map((item) =>
        item.id === editId
          ? normalizeItem({
              ...item,
              title: form.title.trim(),
              type: form.type,
              rating: Number.isFinite(r) ? r : item.rating,
            })
          : item
      )
    );

    setEditId(null);
    setForm({ title: "", type: "movie", rating: 8.0 });
  };

  const closeCrud = () => {
    setShowCrud(false);
    setEditId(null);
    setForm({ title: "", type: "movie", rating: 8.0 });
  };

  // ===== items untuk section row (pakai homeData) =====
  const continueItems = useMemo(() => {
    return continueWatching
      .map((x) => homeData.find((c) => c.id === x.id))
      .filter(Boolean);
  }, [homeData]);

  const topRated = useMemo(() => {
    return [...homeData]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 12);
  }, [homeData]);

  const newReleases = useMemo(() => {
    return homeData.filter((x) => x.isNew).slice(0, 12);
  }, [homeData]);

  const trending = useMemo(() => {
    const marked = homeData.filter((x) => x.isTrending);
    if (marked.length) return marked.slice(0, 12);
    return homeData.slice(0, 12);
  }, [homeData]);

  // HERO carousel items
  const heroItems = useMemo(() => {
    const list = homeData.filter((x) => x.hero);
    return list.length ? list.slice(0, 6) : homeData.slice(0, 6);
  }, [homeData]);

  return (
    <PageShell>
      {/* HERO CAROUSEL */}
      <div className="border-bottom border-secondary">
        <Carousel
          controls={false}
          indicators={false}
          interval={3500}
          pause={false}
          touch
        >
          {heroItems.map((hero) => {
            const heroImg = hero.hero || hero.poster;

            return (
              <Carousel.Item key={hero.id}>
                <div
                  style={{
                    position: "relative",
                    minHeight: 420,
                    backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.85), rgba(0,0,0,.35)), url('${heroImg}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* sound/mute fake button (pojok kanan) */}
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
                      zIndex: 5,
                    }}
                    title={muted ? "Unmute (fake)" : "Mute (fake)"}
                  >
                    <i
                      className={`bi ${
                        muted ? "bi-volume-mute-fill" : "bi-volume-up-fill"
                      }`}
                      style={{ fontSize: 18, color: "#fff" }}
                    />
                  </button>

                  <Container className="py-5">
                    <div className="d-flex gap-2 mb-2">
                      {hero.age && <Badge bg="secondary">{hero.age}</Badge>}
                      {hero.isPremium && (
                        <Badge bg="warning" text="dark">
                          Premium
                        </Badge>
                      )}
                      {hero.isNew && <Badge bg="success">New</Badge>}
                    </div>

                    <h1 className="fw-bold">{hero.title}</h1>
                    <p className="text-secondary col-md-7">
                      {hero.description}
                    </p>

                    <div className="d-flex gap-2">
                      <Button
                        variant="primary"
                        style={{ background: "#3254FF", borderColor: "#3254FF" }}
                        onClick={() => goPlay(hero)}
                      >
                        Mulai
                      </Button>
                      <Button
                        variant="outline-light"
                        onClick={() => openItem(hero)}
                      >
                        Selengkapnya
                      </Button>
                    </div>

                    {/* hint kecil (ga ganggu): bisa dihapus kalau mau */}
                    <div
                      className="text-secondary small mt-3"
                      style={{ opacity: 0.6 }}
                    >
                      {/* Ctrl+M untuk Manage */}
                    </div>
                  </Container>
                </div>
              </Carousel.Item>
            );
          })}
        </Carousel>
      </div>

      {/* SECTIONS */}
      <Container className="py-4">
        {/* ===== HIDDEN CRUD (toggle pakai Ctrl+M) ===== */}
        <div
          style={{
            maxHeight: showCrud ? 1000 : 0,
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}
        >
          {showCrud && (
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h5 className="fw-semibold m-0">Manage</h5>
                <Button size="sm" variant="outline-light" onClick={closeCrud}>
                  Tutup
                </Button>
              </div>

              <div className="bg-dark p-3 rounded-4 border border-secondary">
                {/* FORM */}
                <form
                  onSubmit={editId ? handleUpdate : handleAdd}
                  className="d-flex gap-2 flex-wrap mb-3"
                >
                  <input
                    className="form-control bg-black text-white border-secondary"
                    placeholder="Judul"
                    value={form.title}
                    required
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    style={{ maxWidth: 240 }}
                  />

                  <select
                    className="form-select bg-black text-white border-secondary"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    style={{ maxWidth: 160 }}
                  >
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                  </select>

                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    className="form-control bg-black text-white border-secondary"
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: e.target.value })
                    }
                    style={{ maxWidth: 120 }}
                  />

                  <Button
                    type="submit"
                    style={{ background: "#3254FF", borderColor: "#3254FF" }}
                  >
                    {editId ? "Update" : "Add"}
                  </Button>

                  {editId && (
                    <Button
                      variant="outline-light"
                      onClick={() => {
                        setEditId(null);
                        setForm({ title: "", type: "movie", rating: 8.0 });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </form>

                {/* LIST (READ) */}
                <div className="d-flex flex-column gap-2">
                  {homeData.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="d-flex justify-content-between align-items-center bg-black p-2 rounded-3 border border-secondary"
                    >
                      <div className="d-flex flex-column">
                        <strong>{item.title}</strong>
                        <span className="text-secondary small">
                          {item.type} • ⭐{" "}
                          {(Number.isFinite(Number(item.rating))
                            ? Number(item.rating)
                            : 0
                          ).toFixed(1)}
                          {item.isPremium ? " • Premium" : ""}
                        </span>
                      </div>

                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-light"
                          onClick={() => handleEditStart(item)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="text-secondary small">
                    Menampilkan 6 data teratas. Total data:{" "}
                    <span className="text-white">{homeData.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Section title="Melanjutkan Tonton">
          <PosterHoverRow
            items={continueItems}
            onPlay={goPlay}
            onInfo={openItem}
            progressMap={continueMap}
          />
        </Section>

        <Section title="Top Rating Film dan Series Hari Ini">
          <PosterHoverRow items={topRated} onPlay={goPlay} onInfo={openItem} />
        </Section>

        <Section title="Film Trending">
          <PosterHoverRow items={trending} onPlay={goPlay} onInfo={openItem} />
        </Section>

        <Section title="Rilis Baru">
          <PosterHoverRow
            items={newReleases}
            onPlay={goPlay}
            onInfo={openItem}
          />
        </Section>
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

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h5 className="fw-semibold">{title}</h5>
      {children}
    </div>
  );
}

function PosterHoverRow({ items, onPlay, onInfo, progressMap }) {
  return (
    <div className="d-flex gap-3 overflow-auto pb-3">
      {items.map((it) => (
        <div
          key={it.id}
          className="poster-hover-wrap"
          style={{
            position: "relative",
            transition: "transform .15s ease",
          }}
        >
          <PosterHoverCard
            item={it}
            progress={
              typeof progressMap?.[it.id] === "number"
                ? progressMap[it.id]
                : undefined
            }
            onPlay={onPlay}
            onInfo={onInfo}
          />

          {/* hover lift */}
          <style>{`
            .poster-hover-wrap:hover{
              transform: translateY(-6px) scale(1.02);
              z-index: 10;
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}