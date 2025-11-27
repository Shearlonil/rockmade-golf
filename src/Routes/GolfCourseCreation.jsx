import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Select from 'react-select';
import { Accordion, Button, Col, Form, ProgressBar, Row } from "react-bootstrap";

import IMAGES from "../assets/images";
import { useAuthUser } from "../app-context/user-context";
import ErrorMessage from '../Components/ErrorMessage';
import { ThreeDotLoading } from "../Components/react-loading-indicators/Indicator";
import handleErrMsg from '../Utils/error-handler';
import { dynamic18Fields, dynamic9Fields, holeMode } from "../Utils/data";
import ConfirmDialog from "../Components/DialogBoxes/ConfirmDialog";
import useContestController from '../api-controllers/contest-controller-hook';
import useCourseController from "../api-controllers/course-controller-hook";

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

    const { fetchAllActive: fetchActiveContest } = useContestController();
    const { createCourse } = useCourseController();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [contests, setContests] = useState([]);
    const [holeContestOptions, setHoleContestOptions] = useState([]);
    const [contestsLoading, setContestsLoading] = useState(true);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");

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

        initialize();
        return () => {
            // This cleanup function runs when the component unmounts
            // or when the dependencies of useEffect change (e.g., route change)
            controllerRef.current.abort();
        };
    }, [location.pathname]);

    const initialize = async () => {
        try {
            controllerRef.current = new AbortController();
            setNetworkRequest(true);
            const response = await fetchActiveContest(controllerRef.current.signal);
            setContestsLoading(false);
            setContests(response.data.map(contest => ({label: contest.name, value: contest})));

            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    }

    const onSubmitCourseDetails = async (data) => {
        setFormData(data);
        handleNext();
    };

    const onSubmit9HolesIdxPar = (data) => {
        buildHole(data)
        handleNext();
    };

    const onSubmit18HolesIdxPar = (data) => {
        buildHole(data)
        handleNext();
    };

    const handleNext = () => setStep(step + 1);

	const handleCloseModal = () => setShowConfirmModal(false);

    const handleContestHoleChange = (contest_id, contest_name, data) => {
        const f = {...formData};
        const found = f.contests.filter(c => c.id === contest_id);
        if(found.length > 0){
            found[0].holes = data;
        }else {
            f.contests.push({id: contest_id, name: contest_name, holes: data});
        }
        setFormData(f);
    };

    const handleBack = () => {
        setStep(step - 1);
        formData.contests = [];
    };

    const confirmCourseCreation = () => {
        setDisplayMsg(`Create ${formData.name} with details?`);
        setShowConfirmModal(true);
    }

    const handleSubmit = async () => {
        try {
            setShowConfirmModal(false);
            const arr = [];
            for (const hole of formData.holes) {
                arr.push({
                    hole_no: hole.hole_no,
                    hcp: hole.hcp,
                    par: hole.par
                });
            }
            arr.forEach(hole => {
                for (const contest of formData.contests) {
                    const found = contest.holes.find(h => h.value === hole.hole_no);
                    if(found){
                        // check if contests array already exists in hole
                        if(hole.contests){
                            hole.contests.push(contest.id);
                        }else {
                            hole.contests = [contest.id];
                        }
                    }
                }
            })
            const data = {
                name: formData.name,
                hole_count: formData.hole_mode.value,
                location: formData.location,
            };
            data.holes = arr;
            setNetworkRequest(true);
            // Cancel previous request if it exists
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
            controllerRef.current = new AbortController();
            await createCourse(controllerRef.current.signal, data);
            toast.success("Golf course created successfully");
            setStep(1);
            setNetworkRequest(false);
            navigate('/dashboard/staff/courses/create');
        } catch (error) {
            if (error.name === 'AbortError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

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
        const holeContestsArr = [];
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
                holeContestsArr.push({label: h.hole_no, value: h.hole_no});
                return {hole_no: h.hole_no, hcp: h.value, par: parArr[idx].value};
            });
            const f = {...formData};
            f.holes = holes;
            f.contests = [];
            setHoleContestOptions(holeContestsArr);
            setFormData(f);
        }
    };

	const buildAccordionItem = (contest, i) => {
        return <Accordion.Item eventKey={i} key={i}>
            <Accordion.Header>
                <div className="d-flex flex-column">
                    <span className="mb-2 h6 text-danger fw-bold">
                        {contest.label}
                    </span>
                </div>
            </Accordion.Header>
            <Accordion.Body>
                <Controller
                    name="contests"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <Select
                            isMulti
                            placeholder="contests..."
                            options={holeContestOptions}
                            isLoading={contestsLoading}
                            onChange={(val) => {
                                handleContestHoleChange(contest.value.id, contest.label, val);
                                return onChange(val);
                            }}
                        />
                    )}
                />
            </Accordion.Body>
        </Accordion.Item>
    }

    const buildAccordion = contests.map((datum, i) => { return buildAccordionItem(datum, i) });

	const summarizeHolesContests = (contest, i) => {
        const {id, holes} = contest;
        const found = contests.filter(c => c.value.id === id);
        let name = '';
        if(found){
            name = found[0]?.label
        }
        return <Accordion.Body className="d-flex flex-column" key={i}>
            <span className="h5">
                {name}
            </span>
            <span className="text-danger h6 fw-bold">{holes?.map(obj => obj.value).join(", ")}</span>
        </Accordion.Body>
    }

    const buildContestsSummaryAccordion = formData.contests?.map((datum, i) => { return summarizeHolesContests(datum, i) });

	const summarizeHoles = (contest, i) => {
        return <Accordion.Body className="d-flex flex-column" key={i}>
            <span className="h5">
                Hole {contest.hole_no}
            </span>
            <span className="d-flex ps-3">
                HCP <span className="ms-2 me-2 text-danger fw-bold">{contest.hcp}</span>
                PAR <span className="ms-2 me-2 text-danger fw-bold">{contest.par}</span>
            </span>
        </Accordion.Body>
    }

    const buildHolesSummaryAccordion = formData.holes?.map((datum, i) => { return summarizeHoles(datum, i) });

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
                            <div className="card-body p-4">
                                <div className="text-center mb-4">
                                    <img src={IMAGES.logo} className="text-primary mb-3" width={98} />
                                    <h2 className="fw-bold mb-1">Golf Course Creation</h2>
                                    <p className="text-muted">
                                        Add a new Golf Course to collection
                                    </p>
                                </div>

                                <Form>
                                    <ProgressBar now={(step / 4) * 100} className="mb-3" />

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
                                        <div className="p-5 border rounded-4 bg-light shadow mb-5">
                                            <div className="row">
                                                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                                                    <Form.Label className="fw-bold">Golf Course</Form.Label>
                                                    <Form.Label className="text-primary fw-bold h3">{formData.name}</Form.Label>
                                                </div>
                                                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                                                    <Form.Label className="fw-bold">Location</Form.Label>
                                                    <Form.Label className="text-primary fw-bold h3">{formData.location}</Form.Label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                                                    <Form.Label className="fw-bold">Holes</Form.Label>
                                                    <Form.Label className="text-primary fw-bold h3">{formData.hole_mode.label}</Form.Label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <Accordion alwaysOpen>
                                                    {contests && contests.length > 0 && buildAccordion}
                                                </Accordion>
                                            </div>
                                            <Button onClick={handleNext} className="btn custom-btn w-100 mt-4">Next</Button>
                                        </div>
                                    )}
                                    
                                    {step === 4 && (
                                        <div className="p-5 border rounded-4 bg-light shadow mb-5">
                                            <div className="row">
                                                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                                                    <Form.Label className="fw-bold">Golf Course</Form.Label>
                                                    <Form.Label className="text-primary fw-bold h3">{formData.name}</Form.Label>
                                                </div>
                                                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                                                    <Form.Label className="fw-bold">Location</Form.Label>
                                                    <Form.Label className="text-primary fw-bold h3">{formData.location}</Form.Label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                                                    <Form.Label className="fw-bold">Holes</Form.Label>
                                                    <Form.Label className="text-primary fw-bold h3">{formData.hole_mode.label}</Form.Label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <Accordion alwaysOpen>
                                                    <Accordion.Item eventKey={["0"]}>
                                                        <Accordion.Header>
                                                            <div className="d-flex flex-column">
                                                                <span className="h6 fw-bold">
                                                                    Holes
                                                                </span>
                                                            </div>
                                                        </Accordion.Header>
                                                        {formData.contests && formData.holes.length > 0 && buildHolesSummaryAccordion}
                                                    </Accordion.Item>
                                                </Accordion>
                                            </div>
                                            <div className="row">
                                                <Accordion alwaysOpen>
                                                    <Accordion.Item eventKey={["0"]}>
                                                        <Accordion.Header>
                                                            <div className="d-flex flex-column">
                                                                <span className="h6 fw-bold">
                                                                    Contests
                                                                </span>
                                                            </div>
                                                        </Accordion.Header>
                                                        {formData.contests && formData.contests.length > 0 && buildContestsSummaryAccordion}
                                                    </Accordion.Item>
                                                </Accordion>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-3 d-flex flex-column mt-4 gap-3">
                                        {/* {step < 4 && <Button onClick={handleNext} className="btn custom-btn w-100">Next</Button>} */}
                                        {step === 4 && (
                                            <Button variant="success" onClick={(confirmCourseCreation)} className="btn custom-btn w-100" disabled={networkRequest}>
                                                {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                                                {!networkRequest && 'Create'}
                                            </Button>
                                        )}
                                        {step > 1 && (
                                            <Button variant="primary" onClick={handleBack} className="me-2" disabled={networkRequest}>
                                                Back
                                            </Button>
                                        )}
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
			<ConfirmDialog
				show={showConfirmModal}
				handleClose={handleCloseModal}
				handleConfirm={handleSubmit}
				message={displayMsg}
			/>
        </section>
    );
};

export default GolfCourseCreation;