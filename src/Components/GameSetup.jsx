import { useEffect, useRef, useState } from "react";
import { Button,  Form, } from "react-bootstrap";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import { format } from 'date-fns';
import { toast } from "react-toastify";

import { OrbitalLoading, ThreeDotLoading } from './react-loading-indicators/Indicator';
import HolesContestsDialog from "./DialogBoxes/HolesContestsDialog";
import { useActiveCourses } from "../app-context/active-courses-context";
import handleErrMsg from "../Utils/error-handler";
import useCourseController from "../api-controllers/course-controller-hook";
import { useGame } from "../app-context/game-context";

const GameSetup = ({ gameMode, setUpGame, handleCancel, networkRequest, btnRedText = 'Cancel', btnBlueText = 'Save', setHolesContests, setRounds }) => {
    const controllerRef = useRef(new AbortController());
    const { courseHolesContests, updateCoursesHolesContests } = useActiveCourses();
    const { finById } = useCourseController();
    const { gamePlay } = useGame();
    const data = gamePlay();

    const [gameDetails, setGameDetails] = useState(null);
	const [showHolesContestsModal, setShowHolesContestsModal] = useState(false);
	const [holesContestData, setHolesContestData] = useState([]);
	const [loadingContests, setLoadingContests] = useState(false);

    useEffect(() => {
        if(data){
            /*  this component can be loaded from different pages:
                1.  from GameMode to create new game
                2.  from GameBoard to change settings of yet to play or in-play games
                In case od GameMode, startDate will be available in data. While in GameBoard, the date field will be available due to data fetch from db.
                Hence, two different setup modes: newSetup and oldSetup
            */
            data.startDate ? newSetup() : oldSetup();
        }
    }, [data]);

    const handleCloseModal = () => setShowHolesContestsModal(false);

    const updateHolesContests = (data) => {
        const arr = [];
        data.filter(datum => datum.selectedHoles.length > 0).forEach(datum => arr.push({id: datum.id, name: datum.name, holes: datum.selectedHoles}));
        setHolesContests(arr)
    }

    const incrementRounds = () => {
        const temp = {...gameDetails};
        ++temp.rounds;
        setGameDetails(temp);
        setRounds(temp.rounds);
    }

    const decrementRounds = () => {
        const temp = {...gameDetails};
        --temp.rounds;
        if(temp.rounds > 0){
            setGameDetails(temp);
            setRounds(temp.rounds);
        }
    }

    const newSetup = () => {
        let courseContests = courseHolesContests(data.course.value.id);
        if(courseContests){
            buildContestsData(courseContests);
        }else {
            findCourseHolesContests();
        }
        // startDate in GameMode.jsx and date in GameBoard.jsx
        setGameDetails({
            courseName: data.course.label,
            gameName: data.name,
            startDate: data.startDate,
            rounds: 1,
            holeMode: data.hole_mode.label,
        });
    }

    const oldSetup = () => {
        // startDate in GameMode.jsx and date in GameBoard.jsx
        const arr = [];
        let startHole = 0;
        let endHole = 0
        switch (data.hole_mode) {
            case 1:
                startHole = 1;
                endHole = 18;
                break;
            case 2:
                startHole = 1;
                endHole = 9;
                break;
            case 3:
                startHole = 10;
                endHole = 18;
                break;
        }
        // setup contests data for HolesContestsDialog
        data.Course?.holes?.forEach(hole => {
            if(hole.hole_no >= startHole && hole.hole_no <= endHole){
                hole.contests.forEach(contest => {
                    const c = arr.find(obj => obj.id === contest.id);
                    if(c){
                        c.holes?.push({holeNo: hole.hole_no, id: hole.id, canPick: true});
                    }else {
                        arr.push({
                            id: contest.id,
                            name: contest.name,
                            holes: [{holeNo: hole.hole_no, id: hole.id, canPick: true}],
                            selectedHoles: []
                        });
                    }
                });
            }
        });
        data.GameHoleContests.forEach(gameHoleContest => {
            const c = arr.find(temp => temp.id === gameHoleContest.contest_id);
            if(c) {
                // hole newly selected. Add to list and set canPick for same hole in other contests to false
                // find hole number in Courses.Holes using hole_id in gameHoleContest
                const hole = data.Course?.holes.find(hole => hole.id === gameHoleContest.hole_id)
                c.selectedHoles.push(hole.hole_no);
                arr.filter(tempContest => tempContest.id !== gameHoleContest.contest_id).forEach(tempContest => {
                    const temp = tempContest.holes.find(h => h.holeNo === hole.hole_no);
                    if(temp){
                        temp.canPick = false;
                    }
                });
            }else {
                toast.error("An unexpected error occured. Can't update holes. Please refresh page");
            }
        });
        setHolesContestData(arr);
        let holeMode = '';
        switch (data.hole_mode) {
            case 1:
                holeMode = "Full 18";
                break;
            case 2:
                holeMode = "Front 9";
                break;
            case 3:
                holeMode = "Back 9";
                break;
            default:
                break;
        }
        /*  Possiblity of save button clicked without ever clicking the 'add' button to show contest dialog which builds the contests data (the dialog on minimize, set the holesContests). 
            In this case, the holesContests array will be empty thereby clearing previously selected contests for this game. To prevent this, eagerly build the contests data and save in 
            holesContestss.
        */
        const tempContests = [];
        arr.filter(datum => datum.selectedHoles.length > 0).forEach(datum => tempContests.push({id: datum.id, name: datum.name, holes: datum.selectedHoles}));
        setHolesContests(tempContests);

        setGameDetails({
            courseName: data.Course.name,
            gameName: data.name,
            startDate: data.date,
            rounds: data.rounds,
            holeMode,
        });
    }

    const findCourseHolesContests = async () => {
        try {
            // Cancel previous request if it exists
            resetAbortController();
            setLoadingContests(true);
            const response = await finById(controllerRef.current.signal, data.course.value.id);
            if(response && response.data){
                updateCoursesHolesContests(response.data);
                buildContestsData(response.data);
            }
            setLoadingContests(false);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was aborted, handle silently
                return;
            }
            setLoadingContests(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const buildContestsData = (courseContests) => {
        // setup contests data for HolesContestsDialog
        const arr = [];
        let startHole = 0;
        let endHole = 0
        switch (data.hole_mode.value) {
            case 1:
                startHole = 1;
                endHole = 18;
                break;
            case 2:
                startHole = 1;
                endHole = 9;
                break;
            case 3:
                startHole = 10;
                endHole = 18;
                break;
        }
        courseContests.holes?.forEach(hole => {
            if(hole.hole_no >= startHole && hole.hole_no <= endHole){
                hole.contests.forEach(contest => {
                    const c = arr.find(obj => obj.id === contest.id);
                    if(c){
                        c.holes?.push({holeNo: hole.hole_no, id: hole.id, canPick: true});
                    }else {
                        arr.push({
                            id: contest.id,
                            name: contest.name,
                            holes: [{holeNo: hole.hole_no, id: hole.id, canPick: true}],
                            selectedHoles: []
                        });
                    }
                })
            }
        });
        setHolesContestData(arr);
    };

    const resetAbortController = () => {
        // Cancel previous request if it exists
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
    };

    return (
        <div className="p-5 border rounded-4 bg-light shadow mb-5">
            <h2 className="mb-4 text-center">{gameMode} Setup</h2>

            <div className="row">
                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                    <Form.Label className="fw-bold">Golf Course</Form.Label>
                    <Form.Label className="text-primary fw-bold h3">{gameDetails?.courseName}</Form.Label>
                </div>
                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                    <Form.Label className="fw-bold">Game Name</Form.Label>
                    <Form.Label className="text-primary fw-bold h3">{gameDetails?.gameName}</Form.Label>
                </div>
            </div>

            <div className="row">
                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                    <Form.Label className="fw-bold">Game Date</Form.Label>
                    <Form.Label className="text-primary fw-bold h3">{gameDetails ? format(gameDetails?.startDate, "yyyy-MM-dd") : ''}</Form.Label>
                </div>
                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                    <div className="d-flex gap-5">
                        <div className="d-flex flex-column">
                            <Form.Label className="fw-bold">Holes</Form.Label>
                            <Form.Label className="text-primary fw-bold h3">{gameDetails?.holeMode}</Form.Label>
                        </div>
                        <div className="d-flex flex-column">
                            <Form.Label className="fw-bold">Contests</Form.Label>
                            <Button className="btn-success fw-bold d-flex gap-3 align-items-center justify-content-center" style={{minWidth: '120px'}} onClick={() => setShowHolesContestsModal(true)} disabled={loadingContests}>
                                {loadingContests && <OrbitalLoading color='white' style={{fontSize: '5px'}} /> } Add
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                    <div className="d-flex gap-5">
                        <div className="d-flex flex-column">
                            <Form.Label className="fw-bold">Rounds</Form.Label>
                            <div className="d-flex disabledDiv">
                                <span onClick={() => incrementRounds()} >
                                    <IoAddCircle size={40} color="green" />
                                </span>
                                <Form.Label className="text-primary fw-bold h3 ms-2 me-2">{gameDetails?.rounds}</Form.Label>
                                <span onClick={() => decrementRounds()}  >
                                    <IoRemoveCircle size={40} color="red" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-row row justify-content-center container gap-3 flex-md-row-reverse mt-4">
                <Button onClick={ setUpGame } className="me-2 btn-primary col-md-4 col-sm-12" disabled={networkRequest}>
                    {!networkRequest && `${btnBlueText}`}
                    {networkRequest && <ThreeDotLoading color="#ffffff" size="small" />}
                </Button>
                <Button variant="secondary" onClick={handleCancel} className="me-2 btn-danger col-md-4 col-sm-12" disabled={networkRequest} >
                    {!networkRequest && `${btnRedText}`}
                    {networkRequest && <ThreeDotLoading color="#ffffff" size="small" />}
                </Button>
            </div>
            <HolesContestsDialog
                show={showHolesContestsModal}
                handleClose={handleCloseModal}
                data={holesContestData}
                updateHolesContests={updateHolesContests}
            />
        </div>
    )
}

export default GameSetup;