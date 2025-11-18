import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Button, Col, Form, ProgressBar, Row } from "react-bootstrap";

import IMAGES from "../assets/images";
import { useAuth } from "../app-context/auth-user-context";
import ErrorMessage from '../Components/ErrorMessage';
import { ThreeDotLoading } from "../Components/react-loading-indicators/Indicator";
import handleErrMsg from '../Utils/error-handler';
import GolfCourseRegistration from "./GolfCourseRegistration";

// Dynamic form field configuration
const dynamicFields = [
    { name: 'hcp', type: 'number', label: 'HCP', required: true, min: 1 },
    { name: 'par', type: 'number', label: 'PAR', required: true, min: 1 },
];

// Function to generate dynamic Yup schema
const generateYupSchema = (fields) => {
    const schemaObject = {};
    fields.forEach(field => {
        let validator = yup[field.type](); // Start with a basic type validator

        if (field.required) {
            validator = validator.required(`${field.label} is required`);
        }
        if (field.min) {
            validator = validator.min(field.min, `${field.label} must be at least ${field.min}`);
        }
        // Add more validation rules as needed based on field properties

        schemaObject[field.name] = validator;
    });
    return yup.object().shape(schemaObject);
};

const GolfCourseCreation = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { authUser } = useAuth();
    const user = authUser();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        courseName: "",
        holes: "",
        handicapIndexes: [],
        location: "",
        description: "",
    });

    useEffect(() => {
        if(!user || !user.hasAuth(200)){
            navigate("/");
        }
    }, []);

	const schema = yup.object().shape({
		name: yup
			.string()
			.required("Course name is required"),
		pw: yup
			.string()
			.min(6, "Password must be a min of 6 characters!")
			.required("Input correct password"),
	});

    const dynamicHolesSchema = generateYupSchema(dynamicFields);
    const {
        register: dynamicHoleRegister, 
        handleSubmit: handleSubmitDynamicHole, 
        formState: { dynamicHolesErrors } 
    } = useForm({
        resolver: yupResolver(dynamicHolesSchema),
    });

    // Yup Integration with "react-hook-form"
    const {
        register,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if(!user || !user.hasAuth(200)){
            navigate("/");
        }
    }, []);

    const onSubmit = async (data) => {
        try {
            setIsLoggingIn(true);
            await clientLogin(data);
            setIsLoggingIn(false);
            navigate("/dashboard");
        } catch (ex) {
            setIsLoggingIn(false);
            toast.error(handleErrMsg(ex).msg);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNext = () => {
        // Validation per step
        if (step === 1 && !formData.courseName) {
            alert("Please enter a course name");
            return;
        }
        if (step === 2 && ![9, 18].includes(Number(formData.holes))) {
            alert("Number of holes must be 9 or 18");
            return;
        }
        if (step === 3 && formData.handicapIndexes.some((h) => h === "")) {
            alert("Please enter all handicap indexes");
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const handleHolesSelect = (value) => {
        const numHoles = Number(value);
        setFormData({
            ...formData,
            holes: numHoles,
            handicapIndexes: Array(numHoles).fill(""),
        });
    };

    const handleHandicapChange = (index, value) => {
        const updated = [...formData.handicapIndexes];
        updated[index] = value;
        setFormData({ ...formData, handicapIndexes: updated });
    };

    const handleSubmit = () => {
        alert("Form submitted:\n" + JSON.stringify(formData, null, 2));
        // TODO: Send to API
    };

    return (
        <section  className="position-relative min-vh-100 d-flex align-items-center justify-content-center" style={{ paddingTop: "80px" }} >
            <div className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    backgroundImage: `url(${IMAGES.image4})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(0.6)",
                }}
            ></div>
            {/* dark overlay for background picture */}
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50 text-white"></div>

            <div className="position-relative container">
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="row justify-content-center" >
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className="card border-0 shadow-lg"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              backdropFilter: "blur(10px)",
                            }}
                        >
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <img src={IMAGES.logo} className="text-primary mb-3" width={98} />
                                    <h2 className="fw-bold mb-1">Golf Course Creation</h2>
                                    <p className="text-muted">
                                        Add a new Golf Course to collection
                                    </p>
                                </div>

                                <Form>
                                    <ProgressBar now={(step / 5) * 100} className="mb-3" />

                                    {step === 1 && (
                                        <div className="d-flex flex-column gap-3">
                                            <Form.Group>
                                                <Form.Label className="fw-bold">Course Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="courseName"
                                                    value={formData.courseName}
                                                    onChange={handleChange}
                                                    placeholder="Enter golf course name"
                                                />
                                            </Form.Group>
                                            <Form.Group className="fw-bold">
                                                <Form.Label>Number of Holes</Form.Label>
                                                <Form.Select
                                                    name="holes"
                                                    value={formData.holes}
                                                    onChange={(e) => handleHolesSelect(e.target.value)}
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="9">9 Holes</option>
                                                    <option value="18">18 Holes</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="fw-bold">
                                                <Form.Label>Location</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    placeholder="City, State"
                                                />
                                            </Form.Group>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div>
                                            <Form.Group>
                                                <Form.Label>Number of Holes</Form.Label>
                                                <Form.Select
                                                    name="holes"
                                                    value={formData.holes}
                                                    onChange={(e) => handleHolesSelect(e.target.value)}
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="9">9 Holes</option>
                                                    <option value="18">18 Holes</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div style={{ maxHeight: "500px", overflow: 'scroll' }}>
                                            <h5>Enter <span className="text-danger fw-bold">HCP/PAR</span> value for Each Hole</h5>
                                            <div className="d-flex flex-column justify-content-center gap-3">
                                                {formData.handicapIndexes.map((val, idx) => (
                                                    <div className="shadow border p-3 rounded" key={idx}>
                                                        <span className="fw-bold">Hole {idx + 1}</span>
                                                        <Row>
                                                            <Col xs={6} className="mb-2">
                                                                <Form.Control
                                                                    type="number"
                                                                    min="0"
                                                                    max="54"
                                                                    value={val}
                                                                    onChange={(e) => handleHandicapChange(idx, e.target.value)}
                                                                    placeholder={`HCP`}
                                                                />
                                                            </Col>
                                                            <Col xs={6} className="mb-2">
                                                                <Form.Control
                                                                    type="number"
                                                                    min="0"
                                                                    max="54"
                                                                    value={val}
                                                                    onChange={(e) => handleHandicapChange(idx, e.target.value)}
                                                                    placeholder={`PAR`}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {step === 4 && (
                                        <div>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Location</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    placeholder="City, State"
                                                />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Course Description</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    name="description"
                                                    rows={3}
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    placeholder="Short description of the course"
                                                />
                                            </Form.Group>
                                        </div>
                                    )}

                                    {step === 5 && (
                                        <>
                                            <h4>Confirm Your Details</h4>
                                            <pre>{JSON.stringify(formData, null, 2)}</pre>
                                        </>
                                    )}

                                    <div className="mt-3 d-flex flex-column mt-4 gap-3">
                                        {step < 5 && <Button onClick={handleNext} className="btn custom-btn w-100">Next</Button>}
                                        {step > 1 && (
                                            <Button variant="primary" onClick={handleBack} className="me-2">
                                                Back
                                            </Button>
                                        )}
                                        {step === 5 && (
                                            <Button variant="success" onClick={handleSubmit} className="btn custom-btn w-100">
                                                Submit
                                            </Button>
                                        )}
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default GolfCourseCreation;