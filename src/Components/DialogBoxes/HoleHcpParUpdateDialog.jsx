import { Modal, Button, Accordion, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import ErrorMessage from "../ErrorMessage";
import { ThreeDotLoading } from "../react-loading-indicators/Indicator";

const HoleHcpParUpdateDialog = ({show, handleClose, networkRequest, holeCredentials, updateHoleValues}) => {    
    const schema = yup.object().shape({
        hcp: yup.number().typeError("HCP must be a number").min(1, "Stroke Index must be at least 1").max(18, "Stroke Index cannot exceed 18").required("Stroke Index is required"),
        par: yup.number().typeError("PAR must be a number").min(3, "PAR cannot be less than 3").max(5, "PAR cannot exceed 5").required("PAR is required"),
    });

    const {
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm({
        resolver: yupResolver(schema),
    });

    const modalLoaded = () => {};

    const onSubmit = (data) => {
        updateHoleValues(data);
    };

    return (
        <Modal show={show} onHide={handleClose} onEntered={modalLoaded}>
            <Modal.Header closeButton>
                <Modal.Title className="text-primary fw-bold">Hole {holeCredentials?.no}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span className="h6 fw-bold">Enter new values</span>
                <Accordion defaultActiveKey={['0']} alwaysOpen>
                    <div className="shadow border p-3 rounded mt-2 mb-4 d-flex flex-column gap-2">
                        <Row>
                            <Col xs={6} className="mb-2">
                                <Form.Control
                                    type="number"
                                    placeholder={`HCP`}
                                    {...register('hcp')}
                                />
                                <ErrorMessage source={errors['hcp']} />
                            </Col>
                            <Col xs={6} className="mb-2">
                                <Form.Control
                                    type="number"
                                    placeholder={`PAR`}
                                    {...register('par')}
                                />
                                <ErrorMessage source={errors['par']} />
                            </Col>
                        </Row>
                    </div>
                </Accordion>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success w-25" onClick={handleSubmit(onSubmit)} disabled={networkRequest} >
                    {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                    {!networkRequest && 'Save'}
                </Button>
                <Button variant="danger w-25" onClick={handleClose} disabled={networkRequest}>
                    {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                    {!networkRequest && 'Close'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default HoleHcpParUpdateDialog;