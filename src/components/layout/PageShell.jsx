// src/components/layout/PageShell.jsx
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import ProfileMenu from "../profile/ProfileMenu.jsx";
import Footer from "./Footer.jsx";

export default function PageShell({ children, hideNavbar, hideFooter }) {
  return (
    <div className="min-vh-100 bg-black d-flex flex-column">
      {!hideNavbar && (
        <Navbar
          expand="lg"
          variant="dark"
          className="border-bottom border-secondary"
          style={{ background: "#20252a" }}
        >
          <Container>
            <Navbar.Brand
              as={Link}
              to="/"
              className="d-flex align-items-center gap-2"
              style={{ letterSpacing: "0.14em" }}
            >
              <img
                src="/logo-chill.png"
                alt="CHILL"
                style={{
                  width: 22,
                  height: 22,
                  display: "block",
                  objectFit: "contain",
                }}
              />
              <span style={{ fontWeight: 900, fontSize: 15, color: "#fff" }}>
                CHILL
              </span>
            </Navbar.Brand>

            <Nav className="me-auto gap-3">
              <Nav.Link as={NavLink} to="/series">
                Series
              </Nav.Link>
              <Nav.Link as={NavLink} to="/film">
                Film
              </Nav.Link>
              <Nav.Link as={NavLink} to="/my-list">
                Daftar Saya
              </Nav.Link>
            </Nav>

            <div className="d-flex align-items-center">
              <ProfileMenu />
            </div>
          </Container>
        </Navbar>
      )}

      <main className="flex-grow-1">{children}</main>

      {/* ✅ FOOTER (bisa di-hide) */}
      {!hideFooter && <Footer />}
    </div>
  );
}