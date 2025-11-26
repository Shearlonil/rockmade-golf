import { useEffect, useRef, useState } from "react";
import {
    Form,
    Button,
    Row,
    Col,
    Accordion,
} from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { format } from "date-fns";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAuthUser } from "../../../app-context/user-context";
import IMAGES from "../../../assets/images";
import useCourseController from "../../../api-controllers/course-controller-hook";
import handleErrMsg from "../../../Utils/error-handler";
import { dynamic18Fields, dynamic9Fields, holeMode } from "../../../Utils/data";
import ErrorMessage from "../../../Components/ErrorMessage";
import useGenericController from "../../../api-controllers/generic-controller-hook";

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

export default function GolfCourseView() {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const { finById } = useCourseController();
    const { performGetRequests } = useGenericController();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
    const [step, setStep] = useState(1);
    const [course, setCourse] = useState(null);
    const [contests, setContests] = useState(null);
    const [courseHoles, setCourseHoles] = useState(null);

    const {
        control,
        setValue,
    } = useForm();

    const dynamic9HolesSchema = generateYupSchema(dynamic9Fields);
    const {
        register: dynamic9HoleRegister, 
        setValue: set9HoleValue,
        handleSubmit: handleSubmitDynamic9Holes, 
        formState: { errors: dynamicHolesErrors } 
    } = useForm({
        resolver: yupResolver(dynamic9HolesSchema),
    });
    
    const dynamic18HolesSchema = generateYupSchema(dynamic18Fields);
    const {
        register: dynamic18HoleRegister,
        setValue: set18HoleValue,
        handleSubmit: handleSubmitDynamic18Holes, 
        formState: { errors: dynamic18HolesErrors } 
    } = useForm({
        resolver: yupResolver(dynamic18HolesSchema),
    });

    useEffect(() => {
        if(!user || !user.authorities || user.authorities.length === 0){
            navigate("/");
        }

        initialize();
        return () => {
            // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
            controllerRef.current.abort();
        };
    }, [location.pathname, id]);

    const initialize = async () => {
        try {
            controllerRef.current = new AbortController();
            setNetworkRequest(true);
            const urls = [ `/courses/search/${id}`, '/contests/active/all' ];
            const response = await performGetRequests(urls, controllerRef.current.signal);
            const { 0: courseReq, 1: contestsReq } = response;

            if(courseReq && courseReq.data){
                setCourse(courseReq.data);
                const temp = holeMode.find(mode => mode.value === courseReq.data.no_of_holes);
                setValue('no_of_holes', temp);
                setCourseHoles(temp.value);
            }

            if(contestsReq && contestsReq.data){
                setContests(contestsReq.data);
            }

            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            // setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const handleChange = (e) => {
    };

    const handleNext = () => {
    };

    const handleHolesSelect = (value) => {
    };

    const handleHandicapChange = (index, value) => {
    };

    const handleSubmit = () => {
    };

    const onSubmit9HolesIdxPar = (data) => {
        // buildHole(data)
    };

    const onSubmit18HolesIdxPar = (data) => {
        // buildHole(data)
    };

    const noOfHolesChange = (val) => {
        console.log(val);
    };

    const buildHolesFormFields = () => {
        const objArr = [];
        if(courseHoles === 9){
            for(let i = 0; i < courseHoles * 2; i += 2){
                objArr.push({
                    hole: dynamic9Fields[i],
                    par: dynamic9Fields[i + 1]
                });
            }
            return objArr.map((val, idx) => {
                const hole = course.Holes.find(c => c.hole_no === idx + 1);
                set9HoleValue(val.hole.name, hole.hcp_idx);
                set9HoleValue(val.par.name, hole.par);
                return <div className="shadow border p-3 rounded" key={idx}>
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
            });
        }else if(courseHoles === 18){
            for(let i = 0; i < courseHoles * 2; i += 2){
                objArr.push({
                    hole: dynamic18Fields[i],
                    par: dynamic18Fields[i + 1]
                });
            }
            return objArr.map((val, idx) => {
                const hole = course.Holes.find(c => c.hole_no === idx + 1);
                set18HoleValue(val.hole.name, hole.hcp_idx);
                set18HoleValue(val.par.name, hole.par);
                return <div className="shadow border p-3 rounded" key={idx}>
                    <span className="fw-bold">Hole {idx + 1}</span>
                    <Row>
                        <Col xs={6} className="mb-2">
                            <Form.Control
                                name={val.hole.name}
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
        });
        }
    };

	const buildAccordionItem = (contest, i) => {
        return <Accordion.Item eventKey={i} key={i}>
            <Accordion.Header>
                <div className="d-flex flex-column">
                    <span className="mb-2 h5">
                        {contest.name}
                    </span>
                </div>
            </Accordion.Header>
            <Accordion.Body className="d-flex flex-wrap gap-3">
            </Accordion.Body>
        </Accordion.Item>
    }

    const buildAccordion = contests?.map((datum, i) => { return buildAccordionItem(datum, i) });

    return (
        <section className='container d-flex flex-column gap-4' style={{minHeight: '60vh'}}>
            <Row className='d-flex align-items-center'>
                <div className="d-flex flex-wrap gap-4 align-items-center col-12 col-md-12 mt-4" >
                    <img src={IMAGES.image1} alt ="Avatar" className="rounded-circle" width={100} height={100} />
                    <div className="d-flex flex-wrap gap-2 fw-bold h2">
                        <span>{user.firstName}</span>
                        <span> {user.lastName}</span>
                    </div>
                </div>
            </Row>
            {/* NOTE: setting z-index of this row because of rsuite table which conflicts the drop down menu of react-select */}
            <Row className="card shadow border-0 rounded-3 z-3">
                <div className="card-body row ms-0 me-0">
                    <div className="d-flex gap-3 align-items-center col-12 col-md-4 mb-3">
                        <img src={IMAGES.golf_course} alt ="Avatar" className="rounded-circle" width={50} height={50} />
                        <div className="d-flex flex-column gap-1">
                            <span className="text-danger fw-bold h2"> {course?.name} </span>
                            <div>
                                <span>Created At</span> <span className="text-success fw-bold">{course && format(course?.createdAt, "dd/MM/yyyy")}</span>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-column gap-1 align-items-center justify-content-center col-12 col-md-4">
                        <span className="fw-bold h6">Location</span>
                        <span className="fw-bold text-success h4">{course?.location}</span>
                    </div>

                    <div className="d-flex flex-column gap-1 align-items-center justify-content-center col-12 col-md-4">
                        <span className="fw-bold h6">No. of holes</span>
                        <Controller
                            name="no_of_holes"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    name="no_of_holes"
                                    placeholder="No of Holes..."
                                    className="text-dark w-100"
                                    options={holeMode}
                                    onChange={(val) => { 
                                        noOfHolesChange(val);
                                        onChange(val);
                                    }}
                                    value={value}
                                />
                            )}
                        />
                    </div>
                </div>
            </Row>
            <div className="d-flex flex-column align-items-center">
                <div className="col-12 col-md-7 col-lg-7" style={{ maxHeight: "500px", overflow: 'scroll' }}>
                    {course && courseHoles && buildHolesFormFields()}
                </div>
                <div className="d-flex justify-content-center col-12 col-md-7 col-lg-7">
                    {courseHoles && courseHoles === 9 && <Button onClick={handleSubmitDynamic9Holes(onSubmit18HolesIdxPar)} className="btn custom-btn w-50 mt-4">Update Holes</Button>}
                    {courseHoles && courseHoles === 18 && <Button onClick={handleSubmitDynamic18Holes(onSubmit18HolesIdxPar)} className="btn custom-btn w-50 mt-4">Update Holes</Button>}
                </div>
            </div>
            <div className="d-flex flex-column align-items-center mb-5">
                <div className="col-12 col-md-7 col-lg-7">
                    <Accordion alwaysOpen>
                        {contests && contests.length > 0 && buildAccordion}
                    </Accordion>
                </div>
                <div className="d-flex justify-content-center col-12 col-md-7 col-lg-7">
                    <Button onClick={handleSubmitDynamic9Holes(onSubmit18HolesIdxPar)} className="btn custom-btn w-50 mt-4">Update Contests</Button>
                </div>
            </div>
        </section>
    );
}
