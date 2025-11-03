import IMAGES from "../../assets/images";
import { NavLink, useNavigate } from "react-router-dom";
import "../../Styles/navbarStyle.css"; // custom styles
import { Navbar, Nav, Container } from "react-bootstrap";

function OffcanvasExample() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar expand="lg" bg="" variant="light" className="p-3 shadow">
        <Container>
          <Navbar.Brand onClick={() => navigate("/")}>
            <img src={IMAGES.logo} width={"130px"} height={"50px"} alt="logo" />
          </Navbar.Brand>

          {/* Toggle + mobile donate */}
          <div className="d-flex ms-auto align-items-center">
            {/* Mobile donate */}
            <a
              className="custom-btn btn d-lg-none me-2 text-white"
              href="#section_2"
            >
              Donate
            </a>
            <Navbar.Toggle aria-controls="main-navbar">
              <span className="navbar-toggler-icon"></span>{" "}
            </Navbar.Toggle>{" "}
          </div>

          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto me-lg-5 align-items-lg-center">
              <Nav.Link
                as={NavLink}
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Home
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/about"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                About
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/gameMode"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Game Mode
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/golfCourseRegistration"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Course Registration
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/memberships"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Membership
              </Nav.Link>

              {/* Login/Sign Up Buttons - Desktop */}
              <Nav.Link
                as={NavLink}
                to="/login"
                className="nav-link btn btn-outline-primary ms-2 px-3 py-2"
              >
                Login
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/signup"
                className="nav-link btn btn-primary ms-1 px-3 py-2"
              >
                Sign Up
              </Nav.Link>
            </Nav>

            {/* Desktop donate button */}
            <a
              href="ticket.html"
              className="btn custom-btn d-none d-lg-block text-white ms-2"
            >
              Donate
            </a>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default OffcanvasExample;
