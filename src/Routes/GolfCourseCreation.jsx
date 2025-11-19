import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Select from 'react-select';
import { Button, Col, Form, ProgressBar, Row } from "react-bootstrap";

import IMAGES from "../assets/images";
import { useAuth } from "../app-context/auth-user-context";
import ErrorMessage from '../Components/ErrorMessage';
import { ThreeDotLoading } from "../Components/react-loading-indicators/Indicator";
import handleErrMsg from '../Utils/error-handler';
import { dynamic18Fields, dynamic9Fields, holeMode } from "../Utils/data";

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

const GolfCourseCreation = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { authUser } = useAuth();
    const user = authUser();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if(!user || !user.hasAuth(200)){
            navigate("/");
        }
    }, []);

	const schema = yup.object().shape({
		name: yup.string().required("Course name is required"),
        hole_mode: yup.object().typeError("Select number of holes from the list").required("Select number of holes from the list"),
		location: yup.string().required("Location is required"),
	});

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

    const {
        register,
        control,
        handleSubmit: handleCourseDetailsSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if(!user || !user.hasAuth(200)){
            navigate("/");
        }
    }, []);

    const onSubmitCourseDetails = async (data) => {
        console.log(data);
        setFormData(data);
        setStep(step + 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const onSubmit9HolesIdxPar = (data) => {
        buildHole(data)
        setStep(step + 1);
    };

    const onSubmit18HolesIdxPar = (data) => {
        buildHole(data)
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const buildHolesFormFields = () => {
        const objArr = [];
        if(formData.hole_mode && formData.hole_mode.value === 9){
            for(let i = 0; i < formData.hole_mode.value * 2; i += 2){
                objArr.push({
                    hole: dynamic9Fields[i],
                    par: dynamic9Fields[i + 1]
                });
            }
            return objArr.map((val, idx) => (
                <div className="shadow border p-3 rounded" key={idx}>
                    <span className="fw-bold">Hole {idx + 1}</span>
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
        }else if(formData.hole_mode && formData.hole_mode.value === 18){
            for(let i = 0; i < formData.hole_mode.value * 2; i += 2){
                objArr.push({
                    hole: dynamic18Fields[i],
                    par: dynamic18Fields[i + 1]
                });
            }
            return objArr.map((val, idx) => (
                <div className="shadow border p-3 rounded" key={idx}>
                    <span className="fw-bold">Hole {idx + 1}</span>
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
            const holes = hcpArr.map((h, idx) => ({hole_no: h.hole_no, hcp: h.value, par: parArr[idx].value}));
            const f = {...formData};
            f.holes = holes;
            setFormData(f);
        }
        console.log(formData);
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
                    <div className="col-12 col-md-7 col-lg-7">
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
                                                    name="name"
                                                    placeholder="Enter golf course name"
                                                    {...register("name")}
                                                />
                                                <ErrorMessage source={errors.name} />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label className="fw-bold">Number of Holes</Form.Label>
                                                <Controller
                                                    name="hole_mode"
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Select
                                                            required
                                                            name="hole_mode"
                                                            placeholder="Number of holes..."
                                                            className="text-dark"
                                                            options={holeMode}
                                                            value={value}
                                                            onChange={(val) => { onChange(val) }}
                                                        />
                                                    )}
                                                />
                                                <ErrorMessage source={errors.hole_mode} />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label className="fw-bold">Location</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="location"
                                                    {...register("location")}
                                                    placeholder="City, State"
                                                />
                                                <ErrorMessage source={errors.location} />
                                            </Form.Group>
                                            <Button onClick={handleCourseDetailsSubmit(onSubmitCourseDetails)} className="btn custom-btn w-100 mt-4">Next</Button>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <span>
                                            <div style={{ maxHeight: "500px", overflow: 'scroll' }} className="p-3">
                                                <h5>Enter <span className="text-danger fw-bold">HCP/PAR</span> value for Each Hole</h5>
                                                <div className="d-flex flex-column justify-content-center gap-3">
                                                    {buildHolesFormFields()}
                                                </div>
                                            </div>
                                            {formData.hole_mode && 
                                                formData.hole_mode.value === 9 && 
                                                <Button onClick={handleSubmitDynamic9Holes(onSubmit9HolesIdxPar)} className="btn custom-btn w-100 mt-4">Next</Button>
                                            }
                                            {formData.hole_mode && 
                                                formData.hole_mode.value === 18 && 
                                                <Button onClick={handleSubmitDynamic18Holes(onSubmit18HolesIdxPar)} className="btn custom-btn w-100 mt-4">Next</Button>
                                            }
                                        </span>
                                    )}

                                    {step === 3 && (
                                        <>
                                            <h4>Confirm Your Details</h4>
                                            <pre>{JSON.stringify(formData, null, 2)}</pre>
                                        </>
                                    )}

                                    <div className="mt-3 d-flex flex-column mt-4 gap-3">
                                        {/* {step < 4 && <Button onClick={handleNext} className="btn custom-btn w-100">Next</Button>} */}
                                        {step > 1 && (
                                            <Button variant="primary" onClick={handleBack} className="me-2">
                                                Back
                                            </Button>
                                        )}
                                        {step === 4 && (
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