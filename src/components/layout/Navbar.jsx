import { Container, Navbar as BsNavbar, Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import ProfileMenu from "../profile/ProfileMenu.jsx";

export default function Navbar() {
  const nav = useNavigate();

  return (
    <BsNavbar bg="dark" variant="dark" expand="md" className="border-bottom border-secondary" style={{ background: "#080808" }}>
      <Container>
        <BsNavbar.Brand onClick={() => nav("/")} style={{ cursor: "pointer", fontWeight: 800 }}>
          CHILL
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="nav" />
        <BsNavbar.Collapse id="nav">
          <Nav className="me-auto gap-md-3">
            <NavLink className="nav-link" to="/series">Series</NavLink>
            <NavLink className="nav-link" to="/film">Film</NavLink>
            <NavLink className="nav-link" to="/my-list">Daftar Saya</NavLink>
          </Nav>

          {/* ✅ GANTI dropdown bootstrap jadi Netflix-style */}
          <ProfileMenu />
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
