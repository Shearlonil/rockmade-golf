import { useState } from "react";
import { Modal, Button, Accordion, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { dynamic9Fields, dynamic18Fields } from "../../Utils/data";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import ErrorMessage from "../ErrorMessage";
import { ThreeDotLoading } from "../react-loading-indicators/Indicator";

// Function to generate dynamic Yup schema
const generateYupSchema = (fields) => {
    const schemaObject = {};
    fields.forEach(field => {
        let validator = yup[field.type](); // Start with a basic type validator

        if (field.required) {
            validator = validator.typeError("Number is required").required(`Required`);
        }
        if (field.min) {
            validator = validator.min(field.min, `Must be at least ${field.min}`);
        }
        // Add more validation rules as needed based on field properties

        schemaObject[field.name] = validator;
    });
    return yup.object().shape(schemaObject);
};

const CourseHoleModeUpdateDialog = ({show, handleClose, networkRequest, updateHoleCount, data}) => {
    const [course, setCourse] = useState(null);
    const [holeCount, setHoleCount] = useState(null);

    const dynamic9HolesSchema = generateYupSchema(dynamic9Fields);
    const {
        register: dynamic9HoleRegister, 
        handleSubmit: handleSubmitDynamic9Holes, 
        formState: { errors: dynamicHolesErrors } 
    } = useForm({
        resolver: yupResolver(dynamic9HolesSchema),
    });

    const dynamic18HolesSchema = generateYupSchema(dynamic18Fields);
    const {
        register: dynamic18HoleRegister, 
        handleSubmit: handleSubmitDynamic18Holes, 
        formState: { errors: dynamic18HolesErrors } 
    } = useForm({
        resolver: yupResolver(dynamic18HolesSchema),
    });

    const modalLoaded = () => {
		setCourse(data);
        if(data.no_of_holes === 9){
            setHoleCount(18);
        }else {
            setHoleCount(9);
        }
    };

    const onSubmit = (data) => {
        const holes = buildHole(data);
        if(holes){
            updateHoleCount(holes);
        }else {
            toast.error("HCP and PAR mismatch");
        }
    };

    const buildHole = (data) => {
        const hcpArr = [];
        const parArr = [];
        for (const key in data) {
            if(key.startsWith('hcp')){
                hcpArr.push({name: key, value: data[key], hole_no: key.slice(3) * 1});
            }else if (key.startsWith('par')) {
                parArr.push({name: key, value: data[key], hole_no: key.slice(3) * 1});
            }
        }

        hcpArr.sort((a, b) => a.hole_no - b.hole_no);
        parArr.sort((a, b) => a.hole_no - b.hole_no);

        if(hcpArr.length === parArr.length){
            const holes = hcpArr.map((h, idx) => {
                return {hole_no: h.hole_no, hcp: h.value, par: parArr[idx].value};
            });
            return holes;
        }
        return null;
    };

    const buildHolesFormFields = () => {
        const objArr = [];
        if(holeCount === 9){
            for(let i = 0; i < holeCount * 2; i += 2){
                objArr.push({
                    hole: dynamic9Fields[i],
                    par: dynamic9Fields[i + 1]
                });
            }
            return objArr.map((val, idx) => (
                <div className="shadow border p-3 rounded mt-2 mb-4 d-flex flex-column gap-2" key={idx}>
                    <span className="fw-bold text-success">Hole {idx + 1}</span>
                    <Row>
                        <Col xs={6} className="mb-2">
                            <Form.Control
                                type="number"
                                placeholder={`HCP`}
                                {...dynamic9HoleRegister(val.hole.name)}
                            />
                            <ErrorMessage source={dynamicHolesErrors[val.hole.name]} />
                        </Col>
                        <Col xs={6} className="mb-2">
                            <Form.Control
                                type="number"
                                placeholder={`PAR`}
                                {...dynamic9HoleRegister(val.par.name)}
                            />
                            <ErrorMessage source={dynamicHolesErrors[val.par.name]} />
                        </Col>
                    </Row>
                </div>
            ));
        }else if(holeCount === 18){
            for(let i = 0; i < holeCount * 2; i += 2){
                objArr.push({
                    hole: dynamic18Fields[i],
                    par: dynamic18Fields[i + 1]
                });
            }
            return objArr.map((val, idx) => (
                <div className="shadow border p-3 rounded mt-2 mb-4 d-flex flex-column gap-2" key={idx}>
                    <span className="fw-bold text-success">Hole {idx + 1}</span>
                    <Row>
                        <Col xs={6} className="mb-2">
                            <Form.Control
                                type="number"
                                placeholder={`HCP`}
                                {...dynamic18HoleRegister(val.hole.name)}
                            />
                            <ErrorMessage source={dynamic18HolesErrors[val.hole.name]} />
                        </Col>
                        <Col xs={6} className="mb-2">
                            <Form.Control
                                type="number"
                                placeholder={`PAR`}
                                {...dynamic18HoleRegister(val.par.name)}
                            />
                            <ErrorMessage source={dynamic18HolesErrors[val.par.name]} />
                        </Col>
                    </Row>
                </div>
            ));
        }
    };

    return (
        <Modal show={show} onHide={handleClose} onEntered={modalLoaded}>
            <Modal.Header closeButton>
                <Modal.Title className="text-primary fw-bold">{course?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span className="d-flex gap-3 align-items-center">
                    <span className="h6 fw-bold">New Hole Count</span>
                    <h3 className="text-success"> {holeCount} </h3>
                </span>
                <Accordion defaultActiveKey={['0']} alwaysOpen>
                    <div className="d-flex flex-column" style={{ maxHeight: "500px", overflow: 'scroll' }}>
                        {holeCount && buildHolesFormFields()}
                    </div>
                </Accordion>
            </Modal.Body>
            <Modal.Footer>
                {holeCount === 9 && 
                    <Button variant="success w-25" onClick={handleSubmitDynamic9Holes(onSubmit)} disabled={networkRequest} >
                        {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                        {!networkRequest && 'Save'}
                    </Button>
                }
                {holeCount === 18 &&  
                    <Button variant="success w-25" onClick={handleSubmitDynamic18Holes(onSubmit)} disabled={networkRequest} >
                        {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                        {!networkRequest && 'Save'}
                    </Button>
                }
                <Button variant="danger w-25" onClick={handleClose} disabled={networkRequest}>
                    {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                    {!networkRequest && 'Close'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CourseHoleModeUpdateDialog;