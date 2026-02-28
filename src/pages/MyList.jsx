import { Container } from "react-bootstrap";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell.jsx";
import DetailModal from "../components/media/DetailModal.jsx";
import PremiumModal from "../components/media/PremiumModal.jsx";
import PosterHoverGrid from "../components/media/PosterHoverGrid.jsx";
import { catalog } from "../data/catalog.js";

export default function MyList() {
  const nav = useNavigate();

  const savedItems = useMemo(() => catalog.filter((x) => x.isSaved), []);

  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

  const openItem = (item) => {
    setSelected(item);
    setShowDetail(true);
  };

  const goPlay = (item) => {
    if (item.isPremium) return setShowPremium(true);
    const path =
      item.type === "movie"
        ? `/watch/film/${item.id}`
        : `/watch/series/${item.id}`;
    nav(path);
  };

  return (
    <PageShell>
      <Container className="py-4">
        {/* Header */}
        <div className="mb-4">
          <h4 className="fw-bold">Daftar Saya</h4>
          <div className="text-secondary small">
            {savedItems.length} konten tersimpan
          </div>
        </div>

        {/* Empty State */}
        {savedItems.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            Belum ada film atau series di Daftar Saya.
          </div>
        ) : (
          <PosterHoverGrid items={savedItems} onPlay={goPlay} onInfo={openItem} />
        )}
      </Container>

      {/* Modals */}
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
