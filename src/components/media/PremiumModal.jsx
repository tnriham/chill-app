import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function PremiumModal({ show, onHide }) {
  const nav = useNavigate();
  return (
    <Modal show={show} onHide={onHide} centered contentClassName="bg-dark text-white border-secondary">
      <Modal.Header closeButton closeVariant="white" className="border-secondary">
        <Modal.Title className="fw-bold">Layanan Premium ✨</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-secondary">
          Tingkatkan pengalaman streaming: tanpa iklan, download, dan akses konten eksklusif.
        </p>
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={() => nav("/subscribe")}>Upgrade Premium</Button>
          <Button variant="outline-light" onClick={onHide}>Nanti</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
