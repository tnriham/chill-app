import { Container, Row, Col, Accordion } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="border-top border-secondary mt-5" style={{ background: "#080808" }}>
      <Container className="py-4">
        {/* Desktop */}
        <div className="d-none d-md-block">
          <Row className="g-4">
            <Col md={3}>
              <div className="fw-bold">CHILL</div>
              <div className="text-secondary small mt-2">©2026 Chill.</div>
            </Col>
            <Col md={3}>
              <div className="fw-semibold">Genre</div>
              <div className="text-secondary small mt-2">Aksi</div>
              <div className="text-secondary small">Drama</div>
              <div className="text-secondary small">Komedi</div>
              <div className="text-secondary small">Petualangan</div>
              <div className="text-secondary small">Romantis</div>
            </Col>
            <Col md={3}>
              <div className="fw-semibold">Komedi</div>
              <div className="text-secondary small mt-2">Series &amp; Anime</div>
              <div className="text-secondary small">Petualangan</div>
              <div className="text-secondary small">Romantis</div>
              <div className="text-secondary small">Thriller</div>
            </Col>
            <Col md={3}>
              <div className="fw-semibold">Bantuan</div>
              <div className="text-secondary small mt-2">FAQ</div>
              <div className="text-secondary small">Kontak Kami</div>
              <div className="text-secondary small">Privasi</div>
              <div className="text-secondary small">Syarat &amp; Ketentuan</div>
            </Col>
          </Row>
        </div>

        {/* Mobile Accordion */}
        <div className="d-md-none">
          <div className="fw-bold">CHILL</div>
          <div className="text-secondary small mt-2">©2023 Chill All Rights Reserved.</div>
          <Accordion defaultActiveKey="0" className="mt-3" alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Genre</Accordion.Header>
              <Accordion.Body className="text-secondary small">
                <div>Aksi</div><div>Drama</div><div>Komedi</div><div>Petualangan</div><div>Romantis</div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Bantuan</Accordion.Header>
              <Accordion.Body className="text-secondary small">
                <div>FAQ</div><div>Kontak Kami</div><div>Privasi</div><div>Syarat &amp; Ketentuan</div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </Container>
    </footer>
  );
}
