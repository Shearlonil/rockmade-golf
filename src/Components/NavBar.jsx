import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

import "../Styles/navbarStyle.css"; // custom styles
import IMAGES from "../assets/images";
import { useAuth } from "../app-context/auth-user-context";
import ConfirmDialog from './DialogBoxes/ConfirmDialog';
import { ThreeDotLoading } from "./react-loading-indicators/Indicator";
import handleErrMsg from "../Utils/error-handler";

function OffcanvasExample() {
    const navigate = useNavigate();

	const { authUser, logout } = useAuth();
	const user = authUser();

	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");

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
            <Navbar expand="lg" bg="" variant="light" className="p-3 shadow">
                <Container>
                    <Navbar.Brand onClick={() => navigate("/")}>
                        <img src={IMAGES.logo} width={"130px"} height={"50px"} alt="logo" />
                    </Navbar.Brand>

                    {/* Toggle + mobile donate */}
                    <div className="d-flex ms-auto align-items-center">
                        {/* Mobile login/logout */}
                        {!user && <Nav.Link className={`custom-btn btn d-lg-none me-2 text-white ${isLoggingOut && "disabled"} ${user && 'text-danger'}`} onClick={() => navigate("/login")} >
                            Login 
                        </Nav.Link>}

                        {user && <Nav.Link className={`custom-btn btn d-lg-none me-2 text-white ${isLoggingOut && "disabled"} ${user && 'text-danger'}`} onClick={() => confirmLogout()} >
                            {isLoggingOut && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
							{user && `Logout`}
                        </Nav.Link>}
                        <Navbar.Toggle aria-controls="main-navbar">
                            <span className="navbar-toggler-icon"></span>{" "}
                        </Navbar.Toggle>{" "}
                    </div>

                    <Navbar.Collapse id="main-navbar">
                        <Nav className="ms-auto me-lg-5 align-items-lg-center">
                            <Nav.Link as={NavLink} to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link" } >
                                Home
                            </Nav.Link>

                            <Nav.Link as={NavLink} to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link" } >
                                About
                            </Nav.Link>

                            <Nav.Link as={NavLink} to="/gameMode" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} >
                                Game Mode
                            </Nav.Link>

                            <Nav.Link as={NavLink} to="/golfCourseRegistration" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} >
                                Course Registration
                            </Nav.Link>

                            <Nav.Link as={NavLink} to="/playerRegistration" className={({ isActive }) => isActive ? "nav-link active" : "nav-link" } >
                                Player Registration
                            </Nav.Link>

                            <Nav.Link as={NavLink} to="/memberships" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} >
                                Membership
                            </Nav.Link>
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

export default OffcanvasExample;
