import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../../utils/auth.js";

export default function AppNavbar() {
  const nav = useNavigate();

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "white" : "rgba(255,255,255,.65)",
    textDecoration: "none",
    fontWeight: 600,
    padding: "8px 10px",
    borderRadius: 10,
    background: isActive ? "rgba(50,84,255,.20)" : "transparent",
  });

  return (
    <Navbar expand="lg" variant="dark" style={{ background: "#0b0b0b" }} className="border-bottom border-secondary">
      <Container>
        <Navbar.Brand as={NavLink} to="/film" style={{ fontWeight: 800 }}>
          Chill
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto gap-1">
            <NavLink to="/film" style={linkStyle}>
              Film
            </NavLink>
            <NavLink to="/series" style={linkStyle}>
              Series
            </NavLink>
            <NavLink to="/my-list" style={linkStyle}>
              Daftar Saya
            </NavLink>
            <NavLink to="/profile" style={linkStyle}>
              Profil
            </NavLink>
          </Nav>

          <div className="d-flex gap-2">
            {isLoggedIn() ? (
              <Button
                size="sm"
                variant="outline-light"
                onClick={() => {
                  logout();
                  nav("/login");
                }}
              >
                Keluar
              </Button>
            ) : (
              <Button size="sm" variant="primary" onClick={() => nav("/login")}
                style={{ background: "#3254FF", borderColor: "#3254FF" }}
              >
                Masuk
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
