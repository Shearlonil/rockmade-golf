import { Modal, Button, Form } from "react-bootstrap";

const GameCodesViewDialog = ({ show, handleClose, codes }) => {
    return (
        <Modal show={show} onHide={handleClose} backdrop='static'>
            <Modal.Header closeButton>
                <Modal.Title className="text-success fw-bold">SHARE GAME</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column">
                    <div className="d-flex flex-column gap-1">
                        <label className="form-label fw-bold fs-4">Join Game</label>
                        <Form.Label className="fs-1">{ codes?.join_code }</Form.Label>
                    </div>
                    <hr />
                    <div className="d-flex flex-column">
                        <label className="form-label fw-bold fs-4">View Game</label>
                        <Form.Label className="fs-1">{ codes?.view_code }</Form.Label>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
                <Button variant="success" onClick={handleClose} className="w-50">
                    CLOSE
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GameCodesViewDialog;