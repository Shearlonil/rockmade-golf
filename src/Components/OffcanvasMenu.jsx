import  { useState } from "react";
import { Offcanvas, Nav } from "react-bootstrap";
import { CgMenuLeft } from "react-icons/cg";
import IMAGES from "../assets/images";

const OffcanvasMenu = ({ menuItems = [], menuItemClick = () => {}, variant="success", activeMenuItem }) => {
	/*	to look at later: https://w3collective.com/react-sidebar-navigation-component/	*/

	const style = {
		position: 'fixed',
		bottom: "100px",
		right: '30px',
		cursor: 'pointer',
		zIndex: 999,
		boxShadow: '4px 4px 4px #9E9E9E',
		maxWidth: '50px'
	}
	
	const [show, setShow] = useState(false);
	const [activeMenu, setActiveMenu] = useState(activeMenuItem);

	const handleOnShow = () => setActiveMenu(activeMenuItem);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<div style={style} className={`m-2 p-2 rounded bg-${variant} text-white rounded-5 d-flex justify-content-center`} onClick={handleShow}>
				<CgMenuLeft size={"30px"} />
			</div>

			<Offcanvas show={show} onHide={handleClose} placement="start" onShow={handleOnShow}>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>
						<img src={IMAGES.logo} width={"120px"} />
					</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<Nav className="flex-column">
						{menuItems.length > 0 &&
							menuItems.map((menus) => (
								<Nav.Link
									key={menus.label}
									className={`${activeMenu === menus.label && "nav-link activeLink nav-text" }`}
									onClick={(e) => {
										handleClose();
										menuItemClick(menus, e);
									}}
								>
									{menus.label}
								</Nav.Link>
							))
						}
					</Nav>
				</Offcanvas.Body>
			</Offcanvas>
		</>
	);
};
export default OffcanvasMenu;
