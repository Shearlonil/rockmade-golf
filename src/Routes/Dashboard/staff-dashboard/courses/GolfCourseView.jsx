import { useEffect, useRef, useState } from "react";
import {
    Form,
    Button,
    Row,
    Col,
    Accordion,
    CloseButton,
} from "react-bootstrap";
import { MdChangeCircle } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { format } from "date-fns";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAuthUser } from "../../../../app-context/user-context";
import IMAGES from "../../../../assets/images";
import handleErrMsg from "../../../../Utils/error-handler";
import { dynamic18Fields, dynamic9Fields, holeMode } from "../../../../Utils/data";
import ErrorMessage from "../../../../Components/ErrorMessage";
import ConfirmDialog from "../../../../Components/DialogBoxes/ConfirmDialog";
import { ThreeDotLoading } from "../../../../Components/react-loading-indicators/Indicator";
import useCourseController from "../../../../api-controllers/course-controller-hook";
import useGenericController from "../../../../api-controllers/generic-controller-hook";
import useContestController from "../../../../api-controllers/contest-controller-hook";
import CourseHoleModeUpdateDialog from "../../../../Components/DialogBoxes/CourseHoleModeUpdateDialog";
import HoleHcpParUpdateDialog from "../../../../Components/DialogBoxes/HoleHcpParUpdateDialog";

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

    const { updateCourseHoleCount, updateCourseHole } = useCourseController();
    const { performGetRequests } = useGenericController();
    const { removeHole, updateHoles } = useContestController();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
    // for holding props of holes to remove from contests (this will be sent to server)
    const [holeToRemoveProp, setHoleToRemoveProp] = useState(null);
    // for holding data to send to server for updating holes assigned to contests
    const [holesToUpdate, setHolesToUpdate] = useState(null);
    const [course, setCourse] = useState(null);
    const [holeCount, setHoleCount] = useState(null);
    const [holeCredentials, setHoleCredentials] = useState(null);
    const [contests, setContests] = useState(null);
    const [contestArrOptions, setContestArrOptions] = useState([]);

	const [showCourseHoleModeUpdate, setShowCourseHoleModeUpdate] = useState(false);
	const [showHoleHcpParUpdate, setShowHoleHcpParUpdate] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");
    const [confirmDialogEvtName, setConfirmDialogEvtName] = useState(null);

    const {
        control,
        handleSubmit,
    } = useForm();

    const dynamic9HolesSchema = generateYupSchema(dynamic9Fields);
    const {
        register: dynamic9HoleRegister, 
        setValue: set9HoleValue,
        formState: { errors: dynamicHolesErrors } 
    } = useForm({
        resolver: yupResolver(dynamic9HolesSchema),
    });
    
    const dynamic18HolesSchema = generateYupSchema(dynamic18Fields);
    const {
        register: dynamic18HoleRegister,
        setValue: set18HoleValue,
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

            let courseHoles = [];
            if(courseReq && courseReq.data){
                setCourse(courseReq.data);
                courseHoles = courseReq.data.holes;
                setHoleCount(courseReq.data.no_of_holes);
            }
            
            if(contestsReq && contestsReq.data){
                setUpContests(contestsReq.data, courseHoles);
            }
            
            setNetworkRequest(false);
        } catch (error) {
            console.log(error);
            setNetworkRequest(false);
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            toast.error(handleErrMsg(error).msg);
        }
    };

    const askToRemove = (hole_id, hole_no, contest_id, contest_name) => {
        setDisplayMsg(`Remove hole ${hole_no} from ${contest_name} ?`);
        setHoleToRemoveProp({hole_id, contest_id, hole_no});
        setShowConfirmModal(true);
        setConfirmDialogEvtName('removeHole');
    };

    const handleConfirm = () => {
        switch (confirmDialogEvtName) {
            case 'removeHole':
                removeHoleFromContest();
                break;
            case 'updateHoles':
                updateHolesContests();
                break;
        }
    };

    // called by handleSubmit of Update Contests button
    const updateContests = (data) => {
        const tempContests = [];
        for (const key in data) {
            if(data[key]){
                const arr = data[key].map(element => element.value.id);
                tempContests.push({contest_id: key, holes: arr});
            }
        }
        if(tempContests.length > 0){
            setHolesToUpdate({contests: [...tempContests], course_id: id});
            setDisplayMsg(`Update Holes with Contests ?`);
            setShowConfirmModal(true);
            setConfirmDialogEvtName('updateHoles');
        }
    };

	const handleCloseModal = () => {
        setShowConfirmModal(false);
        setShowCourseHoleModeUpdate(false);
        setShowHoleHcpParUpdate(false);
    };

    const updateHoleCount = async (data) => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            const response = await updateCourseHoleCount(controllerRef.current.signal, {course_id: course.id, holes: data});
            // update necessary fields in course
            const c = {...course};
            c.Holes = response.data;
            c.no_of_holes = response.data.length;
            setCourse(c);
            setUpContests(contests, response.data);
            setHoleCount(response.data.length);
            setShowCourseHoleModeUpdate(false);
            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const editHole = (hole, val) => {
        setHoleCredentials({ ...val, id: hole.CourseHoles.id, no: hole.CourseHoles.hole_no });
        setShowHoleHcpParUpdate(true);
    };

    // used to update values in react-select
    const handleHoleHcpParUpdate = async (data) => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            await updateCourseHole(controllerRef.current.signal, { course_id: course.id, hole_id: holeCredentials.id, hcp: data.hcp, par: data.par } );
            setNetworkRequest(false);
            setShowHoleHcpParUpdate(false);
            const c = {...course}
            const hole = c.Holes.find(c => c.id === holeCredentials.id);
            hole.hcp_idx = data.hcp;
            hole.par = data.par;
            setCourse(c);
        } catch (error) {
            if (error.name === 'AbortError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const updateHolesContests = async () => {
        try {
            setShowConfirmModal(false);
            setNetworkRequest(true);
            resetAbortController();
            await updateHoles(controllerRef.current.signal, holesToUpdate);
            // structure of holesToUpdate sent to server {contests: [ {contest_id, holes: [id, id, ...]} ]}
            const arrOptions = [...contestArrOptions];
            const tempContests = [...contests];
            for (const contest of holesToUpdate.contests) {
                contest.holes.forEach(hole_id => {
                    /*  find the particular contest of concern in contestArrOptions
                        NOTE: not using the strict equality operator because, contest_id is string
                    */
                    const contestOption = arrOptions.find(option => option.id == contest.contest_id);
                    const idx = contestOption.contestOptions.findIndex(co => co.value.id === hole_id);
                    const removed = contestOption.contestOptions.splice(idx, 1);
                    // add removed from contestArrOption to contest.Holes to display as newly added
                    const found = tempContests.find(c => c.id == contest.contest_id);
                    found.holes.push({id: removed[0].value.id, hole_no: removed[0].label});
                });
            }
            setContests(tempContests);
            setContestArrOptions(arrOptions);
            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const removeHoleFromContest = async () => {
        try {
            resetAbortController()
            setShowConfirmModal(false);
            setNetworkRequest(true);
            await removeHole(controllerRef.current.signal, holeToRemoveProp);
            setNetworkRequest(false);
            // after successfull hole removal from contest in db, add removed hole as an option back to drop down in order to add it back to contest
            const obj = contestArrOptions.find(option => option.id === holeToRemoveProp.contest_id);
            obj.contestOptions.push({label: holeToRemoveProp.hole_no, value: {id: holeToRemoveProp.hole_id, hole_no: holeToRemoveProp.hole_no}});
            // remove hole from contest in UI
            const c = [...contests]
            const temp = c.find(contest => contest.id === holeToRemoveProp.contest_id);
            const holes = temp.holes.filter(hole => hole.id !== holeToRemoveProp.hole_id);
            temp.holes = holes;
            setContests(c);
            setNetworkRequest(false);
            setHoleToRemoveProp(null);
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
        if(holeCount === 9){
            for(let i = 0; i < holeCount * 2; i += 2){
                objArr.push({
                    hole: dynamic9Fields[i],
                    par: dynamic9Fields[i + 1]
                });
            }
            return objArr.map((val, idx) => {
                const hole = course.Holes.find(c => c.hole_no === idx + 1);
                set9HoleValue(val.hole.name, hole.hcp_idx);
                set9HoleValue(val.par.name, hole.par);
                return <div className="shadow border p-3 rounded mt-2 mb-4" key={idx}>
                   <div className="d-flex justify-content-between">
                         <span className="fw-bold text-success">Hole {idx + 1}</span>
                         <MdChangeCircle size={30} style={{ color: 'blue' }} onClick={() => editHole(hole, val)} />
                   </div>
                    <Row>
                        <Col xs={6} className="mb-2">
                            <span>HCP</span>
                            <Form.Control
                                type="number"
                                disabled
                                placeholder={`HCP`}
                                {...dynamic9HoleRegister(val.hole.name)}
                            />
                            <ErrorMessage source={dynamicHolesErrors[val.hole.name]} />
                        </Col>
                        <Col xs={6} className="mb-2">
                            <span>PAR</span>
                            <Form.Control
                                type="number"
                                disabled
                                placeholder={`PAR`}
                                {...dynamic9HoleRegister(val.par.name)}
                            />
                            <ErrorMessage source={dynamicHolesErrors[val.par.name]} />
                        </Col>
                    </Row>
                </div>
            });
        }else if(holeCount === 18){
            for(let i = 0; i < holeCount * 2; i += 2){
                objArr.push({
                    hole: dynamic18Fields[i],
                    par: dynamic18Fields[i + 1]
                });
            }
            return objArr.map((val, idx) => {
                const hole = course.holes.find(c => c.hole_no === idx + 1);
                set18HoleValue(val.hole.name, hole.CourseHoles.hcp_idx);
                set18HoleValue(val.par.name, hole.CourseHoles.par);
                return <div className="shadow border p-3 rounded mt-2 mb-4" key={idx}>
                   <div className="d-flex justify-content-between">
                         <span className="fw-bold text-success">Hole {idx + 1}</span>
                         <MdChangeCircle size={30} style={{ color: 'blue' }} onClick={() => editHole(hole, val)} />
                   </div>
                    <Row>
                        <Col xs={6} className="mb-2">
                            <span>HCP</span>
                            <Form.Control
                                name={val.hole.name}
                                type="number"
                                disabled
                                placeholder={`HCP`}
                                {...dynamic18HoleRegister(val.hole.name)}
                            />
                            <ErrorMessage source={dynamic18HolesErrors[val.hole.name]} />
                        </Col>
                        <Col xs={6} className="mb-2">
                            <span>PAR</span>
                            <Form.Control
                                type="number"
                                disabled
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

    const buildContestHoleBadges = (contest) => {
        return contest.holes.map(({ id, hole_no }, index) => (
            <div key={index}  className={`bg-success-subtle text-dark rounded-3 fw-bold p-2 fs-6 d-flex align-items-center justify-content-between`} >
                <small className="pe-2 me-2 m-0">{hole_no}</small>
                <div className="d-flex gap-2">
                    <CloseButton className="p-0" onClick={() => askToRemove(id, hole_no, contest.id, contest.name)} aria-label="Hide" />
                </div>
            </div>
        ));
    };

	const buildAccordionItem = (contest, i) => {
        const contestArrOption = contestArrOptions.find(option => option.id === contest.id);
        const name = contest.id;
        return <Accordion.Item eventKey={i} key={i}>
            <Accordion.Header>
                <div className="d-flex flex-column">
                    <span className="mb-2 h5">
                        {contest.name}
                    </span>
                </div>
            </Accordion.Header>
            <Accordion.Body className={`d-flex flex-wrap gap-3 ${networkRequest ? 'disabledDiv' : ''}`}>
                <Controller
                    name={name.toString()} // convert the id type number to string, else exception
                    control={control}
                    render={({ field: { onChange } }) => (
                        <Select
                            /*  For clearing react-select
                                ref: https://stackoverflow.com/questions/50412843/how-to-programmatically-clear-reset-react-select
                            */
                            key={`${JSON.stringify(contest)}`}
                            isMulti
                            name={name.toString()}
                            placeholder="holes..."
                            options={contestArrOption ? contestArrOption.contestOptions : []}
                            isLoading={networkRequest}
                            className="w-100"
                            onChange={val =>  onChange(val) }
                        />
                    )}
                />
                {buildContestHoleBadges(contest)}
            </Accordion.Body>
        </Accordion.Item>
    }

    const buildAccordion = contests?.map((datum, i) => { return buildAccordionItem(datum, i) });

    const resetAbortController = () => {
        // Cancel previous request if it exists
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
    };

    const setUpContests = (data, courseHoles) => {
        const options = []; // structure of obj stored in this arr {id: contest_id, contestOptions: [{label: hole.hole_no, value: {id: hole.id, hole_no:hole.hole_no}}]}
        data.forEach(datum => {
            datum.holes = [];
            courseHoles.forEach(hole => {
                /*  if hole has contest, add to list of contest holes to display under the Contest dropdown.
                    Else, add to options to display in dropdown of contest
                */
                let f = hole.contests?.find(contest => contest.id === datum.id);
                if(f){
                    datum.holes.push({id: hole.id, hole_no: hole.hole_no});
                }else {
                    // check if contest obj already exists in options arr
                    const opt = options.find(option => option.id === datum.id);
                    if(opt){
                        opt.contestOptions.push({label: hole.hole_no, value: {id: hole.id, hole_no:hole.hole_no}});
                    }else {
                        options.push({id: datum.id, contestOptions: [{label: hole.hole_no, value: {id: hole.id, hole_no: hole.hole_no}}]});
                    }
                }
            });
        })
        setContestArrOptions(options);
        setContests(data);
    }

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

                    <div className="d-flex gap-3 align-items-center justify-content-center col-12 col-md-4">
                        <div className="d-flex flex-column">
                            <span className="fw-bold h6">No. of holes</span>
                            <span className="fw-bold text-success h4"> {holeCount} </span>
                        </div>
                        <IoSettings size={35} style={{ color: 'blue' }} onClick={() => setShowCourseHoleModeUpdate(true)} />
                    </div>
                </div>
            </Row>
            <div className="d-flex flex-column align-items-center">
                <div className="col-12 col-md-7 col-lg-7" style={{ maxHeight: "500px", overflow: 'scroll' }}>
                    {course && holeCount && buildHolesFormFields()}
                </div>
            </div>

            <span className="text-success fw-bold h2 d-flex flex-column align-items-center"> CONTESTS </span>

            <div className="d-flex flex-column align-items-center mb-5">
                <div className="col-12 col-md-7 col-lg-7">
                    <Accordion alwaysOpen>
                        {contests && contests.length > 0 && buildAccordion}
                    </Accordion>
                </div>
                <div className="d-flex justify-content-center col-12 col-md-7 col-lg-7">
                    <Button onClick={handleSubmit(updateContests)} className="btn custom-btn w-50 mt-4" disabled={networkRequest}>
                        {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                        {!networkRequest && 'Update Contests'}
                    </Button>
                </div>
            </div>
			<ConfirmDialog
				show={showConfirmModal}
				handleClose={handleCloseModal}
				handleConfirm={handleConfirm}
				message={displayMsg}
			/>
            <CourseHoleModeUpdateDialog
                show={showCourseHoleModeUpdate}
                handleClose={handleCloseModal}
                networkRequest={networkRequest}
                updateHoleCount={updateHoleCount}
                data={course}
            />
            <HoleHcpParUpdateDialog
                show={showHoleHcpParUpdate}
                handleClose={handleCloseModal}
                networkRequest={networkRequest}
                holeCredentials={holeCredentials}
                updateHoleValues={handleHoleHcpParUpdate}
            />
        </section>
    );
}
