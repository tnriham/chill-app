import { Modal, Button, Badge } from "react-bootstrap";

export default function DetailModal({ show, onHide, item, onPlay, onRequirePremium }) {
  if (!item) return null;

  const isSeries = item.type === "series";

  const handlePlay = () => {
    if (item.isPremium) return onRequirePremium?.();
    onPlay?.(item);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="bg-dark text-white border-secondary">
      <Modal.Header closeButton closeVariant="white" className="border-secondary">
        <Modal.Title className="fw-bold">{item.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex gap-3">
          <img
            src={item.poster}
            alt={item.title}
            style={{ width: 160, height: 240, objectFit: "cover", borderRadius: 12 }}
          />
          <div className="flex-grow-1">
            <div className="d-flex gap-2 mb-2">
              {item.isPremium && <Badge bg="warning" text="dark">Premium</Badge>}
              {item.isNew && <Badge bg="success">New</Badge>}
              {item.age && <Badge bg="secondary">{item.age}</Badge>}
            </div>
            <div className="text-secondary small">
              {item.year} • {item.duration} • Rating {item.rating}
            </div>
            <p className="mt-3 text-secondary">{item.description}</p>

            <div className="d-flex gap-2 mt-3">
              <Button variant="primary" onClick={handlePlay}>Mulai</Button>
              <Button variant="outline-light" onClick={onHide}>Tutup</Button>
            </div>
          </div>
        </div>

        {isSeries ? (
          <div className="mt-4">
            <div className="fw-semibold mb-2">Episode</div>
            <div className="border border-secondary rounded-3 overflow-auto" style={{ maxHeight: 240 }}>
              {(item.episodes || []).map((ep) => (
                <div key={ep.no} className="d-flex gap-3 p-2 border-bottom border-secondary">
                  <img src={ep.thumb} alt={ep.title} style={{ width: 96, height: 54, objectFit: "cover", borderRadius: 8 }} />
                  <div className="flex-grow-1">
                    <div className="fw-semibold small">{ep.no}. {ep.title}</div>
                    <div className="text-secondary small">{ep.duration}</div>
                    <div className="text-secondary small">{ep.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Modal.Body>
    </Modal>
  );
}
