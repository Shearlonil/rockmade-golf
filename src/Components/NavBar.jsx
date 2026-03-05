import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

import "../Styles/navbarStyle.css"; // custom styles
import IMAGES from "../assets/images";
import { useAuth } from "../app-context/auth-context";
import ConfirmDialog from './DialogBoxes/ConfirmDialog';
import { ThreeDotLoading } from "./react-loading-indicators/Indicator";
import handleErrMsg from "../Utils/error-handler";
import { useAuthUser } from "../app-context/user-context";

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();

	const { logout } = useAuth();
    const { authUser } = useAuthUser();
	const user = authUser();

	const [expanded, setExpanded] = useState(false);

	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");

	const handleToggle = () => {
		setExpanded(!expanded);
	};

	const handleNavSelect = () => {
		setExpanded(false); // Close the navbar on selection (for mobile)
	};

	const handleCloseModal = () => {
		setShowConfirmModal(false);
	};

	const confirmLogout = () => {
		setDisplayMsg(`Logout your account?`);
		setShowConfirmModal(true);
	};

	const handleLogout = async () => {
		// call logout endpoint
		try {
			setShowConfirmModal(false);
			setIsLoggingOut(true);
			await logout();
			setIsLoggingOut(false);
		} catch (error) {
			// display error message
			toast.error(handleErrMsg(error).msg);
			setIsLoggingOut(false);
		}
	};

    return (
        <>
            <Navbar expand="lg" expanded={expanded} bg="" variant="light" className="p-3 shadow" onToggle={handleToggle}>
                <Container>
                    <Navbar.Brand 
                        onClick={() => {
                            navigate("/");
                            handleNavSelect();
                        }}
                    >
                        <img src={IMAGES.logo} width={"130px"} height={"50px"} alt="logo" />
                    </Navbar.Brand>

                    {/* Toggle + mobile donate */}
                    <div className="d-flex ms-auto align-items-center">
                        {/* Mobile login/logout */}
                        {!user && <Nav.Link className={`custom-btn btn d-lg-none me-2 text-white ${isLoggingOut && "disabled"} ${user && 'text-danger'}`} 
                            onClick={() => {
                                navigate("/login");
                                handleNavSelect();
                            }} 
                            >
                            Login 
                        </Nav.Link>}

                        {user && <Nav.Link className={`custom-btn btn d-lg-none me-2 text-white ${isLoggingOut && "disabled"} ${user && 'text-danger'}`} 
                            onClick={() => {
                                confirmLogout();
                                handleNavSelect();
                            }} 
                        >
                            {isLoggingOut && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
							{user && `Logout`}
                        </Nav.Link>}
                        <Navbar.Toggle aria-controls="main-navbar">
                            <span className="navbar-toggler-icon"></span>{" "}
                        </Navbar.Toggle>{" "}
                    </div>

                    <Navbar.Collapse id="main-navbar">
                        <Nav className="ms-auto me-auto align-items-lg-center">
                            <Nav.Link as={NavLink} to="/" onClick={handleNavSelect} className={`${location.pathname === "/" && "nav-link activeLink nav-text" }`} >
                                Home
                            </Nav.Link>

                            <Nav.Link as={NavLink} to="/about" onClick={handleNavSelect} className={`${location.pathname === "/about" && "nav-link activeLink nav-text" }`} >
                                About
                            </Nav.Link>

                            <Nav.Link as={NavLink} to="/memberships" onClick={handleNavSelect} className={`${location.pathname === "/memberships" && "nav-link activeLink nav-text" }`} >
                                Membership
                            </Nav.Link>

							{user && <Nav.Link as={NavLink} to="/dashboard" onClick={handleNavSelect} className={`${location.pathname === "/dashboard" && "nav-link activeLink nav-text" }`} >
								Dashboard
							</Nav.Link>}
                        </Nav>

                        {/* Desktop login/logout buttons */}
                        {!user && <Nav.Link className={`btn custom-btn d-none d-lg-block text-white ms-2 ${isLoggingOut && "disabled"} ${user && 'text-danger'}`} onClick={() => navigate("/login")} >
                            Login 
                        </Nav.Link>}

                        {user && <Nav.Link className={`btn custom-btn d-none d-lg-block text-white ms-2 ${isLoggingOut && "disabled"} ${user && 'text-danger'}`} onClick={() => confirmLogout()} >
                            {isLoggingOut && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
							{user && `Logout`}
                        </Nav.Link>}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
			<ConfirmDialog
				show={showConfirmModal}
				handleClose={handleCloseModal}
				handleConfirm={handleLogout}
				message={displayMsg}
			/>
        </>
    );
}

export default NavBar;
