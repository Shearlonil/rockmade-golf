import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IoSettings } from "react-icons/io5";
import { Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { format } from "date-fns";

import IMAGES from '../../../../assets/images';
import cryptoHelper from '../../../../Utils/crypto-helper';
import { useAuth } from '../../../../app-context/auth-context';
import { useAuthUser } from '../../../../app-context/user-context';
import handleErrMsg from '../../../../Utils/error-handler';
import useGenericController from '../../../../api-controllers/generic-controller-hook';
import OffcanvasMenu from '../../../../Components/OffcanvasMenu';
import { OrbitalLoading } from '../../../../Components/react-loading-indicators/Indicator';
import GroupScore from './GroupScore';
import LeaderBoards from './LeaderBoards';
import GameSettings from './GameSettings';
import CourseSetup from '../../../../Components/CourseSetup';
import { useActiveCourses } from '../../../../app-context/active-courses-context';
import ConfirmDialog from '../../../../Components/DialogBoxes/ConfirmDialog';
import GameSetup from '../../../../Components/GameSetup';
import HolesContestsDialog from '../../../../Components/DialogBoxes/HolesContestsDialog';

const GameBoard = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const { setCourses, setLoadingCourses } = useActiveCourses();
    const { logout } = useAuth();
    const { performGetRequests } = useGenericController();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
	const [holesContestData, setHolesContestData] = useState([]);
    // course data
    const [ongoingRound, setOngoingRound] = useState(null);
    // Game data
    const [gameData, setGameData] = useState(null);
    const [playerScores, setPlayerScores] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [gameMode, setGameMode] = useState(null);
    
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");
    const [confirmDialogEvtName, setConfirmDialogEvtName] = useState(null);
    const [updatedCourseData, setUpdatedCoureData] = useState(null);
	const [showHolesContestsModal, setShowHolesContestsModal] = useState(false);

    const offCanvasMenu = [
        { label: "Enter Score", onClickParams: {evtName: 'enterScore'} },
        { label: "Leaderboards", onClickParams: {evtName: 'leaderboards'} },
        { label: "Settings", onClickParams: {evtName: 'settings'} },
    ];
    
    useEffect(() => {
        if(!user || cryptoHelper.decryptData(user.mode) !== '1'){
            logoutUnauthorized();
        }

        initialize();
        return () => {
            // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
            controllerRef.current.abort();
        };
    }, [location.pathname]);

    const logoutUnauthorized = async () => {
        setNetworkRequest(true);
        await logout();
        navigate("/");
    }

    const initialize = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            const urls = [ `/games/rounds/ongoing/${id}`, '/courses/active/all' ];
            const response = await performGetRequests(urls, controllerRef.current.signal);
            const { 0: ongoingRoundsReq, 1: coursesReq } = response;

            if(ongoingRoundsReq && ongoingRoundsReq.data){
                setOngoingRound(ongoingRoundsReq.data);
                switch (ongoingRoundsReq.data.mode) {
                    case 1:
                        setGameMode('Tournament');
                        break;
                    case 2:
                        setGameMode('Member Games');
                        break;
                    case 3:
                        setGameMode('Versus');
                        break;
                    default:
                        break;
                }
            }

            if(coursesReq && coursesReq.data){
                setCourses(coursesReq.data);
                setLoadingCourses(false);
            }
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

	const handleOffCanvasMenuItemClick = async (onclickParams, e) => {
		switch (onclickParams.evtName) {
            case 'enterScore':
                setPageNumber(1);
                break;
            case 'leaderboards':
                setPageNumber(2);
                break;
            case 'settings':
                setPageNumber(3);
                break;
        }
	}

    const changePageNumber = (pageNumber) => {
        setPageNumber(pageNumber);
    }

    const handleSaveCourseSetting = (data) => {
        setConfirmDialogEvtName('save')
        setDisplayMsg('Update Course for the ongoing game??');
        setShowConfirmModal(true);
        setUpdatedCoureData(data);
    }

	const handleCloseModal = () => {
        setShowConfirmModal(false);
        setShowHolesContestsModal(false);
    };
  
    const handleConfirm = async () => {
        setShowConfirmModal(false);
        switch (confirmDialogEvtName) {
            case "remove":
                break;
            case "restore":
                break;
            case 'save':
                updateGameCourse();
        }
    };

    const updateHolesContest = (data) => {
        const arr = [];
        data.filter(datum => datum.selectedHoles.length > 0).forEach(datum => arr.push({id: datum.id, name: datum.name, holes: datum.selectedHoles}));
        // const c = {...course};
        // c.contests = arr;
        // setCourse(c);
        // setCourseSettingData(c);
    }

    const updateGameCourse = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            console.log(updatedCourseData, ongoingRound);
            // await update(controllerRef.current.signal, {id: editedContest.id, name: editedContest.name, location: editedContest.location});
            setConfirmDialogEvtName(null);
            setNetworkRequest(false);
            setUpdatedCoureData(null);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    }

    const setUpGame = async () => {
        try {
            // Cancel previous request if it exists
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
            controllerRef.current = new AbortController();
            setNetworkRequest(true);
            // await createGame(controllerRef.current.signal, data);
            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError') {
                // Request was aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };
  

    const resetAbortController = () => {
        // Cancel previous request if it exists
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
    };

    return (
        <section className='container d-flex flex-column gap-4' style={{minHeight: '80vh'}}>
            <OffcanvasMenu menuItems={offCanvasMenu} menuItemClick={handleOffCanvasMenuItemClick} variant='danger' />
            {/* NOTE: setting z-index of this row because of rsuite table which conflicts the drop down menu of react-select */}
            <Row className="card shadow border-0 rounded-3 z-3 mt-5">
                <div className="card-body row ms-0 me-0 d-flex justify-content-between">
                    <div className="d-flex gap-3 align-items-center justify-content-center col-12 col-md-4 mb-3">
                        <img src={IMAGES.golf_course} alt ="Avatar" className="rounded-circle" width={50} height={50} />
                        <div className="d-flex flex-column gap-1">
                            <span className="text-danger fw-bold h2"> {ongoingRound?.name} </span>
                            <span className="text-success fw-bold">{ongoingRound && format(ongoingRound?.createdAt, "dd/MM/yyyy")}</span>
                        </div>
                    </div>

                    <div className="d-flex flex-column gap-1 align-items-center justify-content-center col-12 col-md-4">
                        <span className="fw-bold h6">Location</span>
                        <span className="fw-bold text-success h4">{ongoingRound?.course_name}</span>
                    </div>

                    <div className="d-flex flex-column gap-1 align-items-center justify-content-center col-12 col-md-4">
                        <IoSettings size={35} style={{ color: 'blue' }} onClick={() => setPageNumber(3)} />
                        <span className="fw-bold h6">Settings</span>
                    </div>
                </div>
            </Row>
            <div className="justify-content-center d-flex">
                {networkRequest && <OrbitalLoading color='red' />}
            </div>
            {pageNumber === 1 && <GroupScore holeMode={ongoingRound?.hole_mode} playerScores={playerScores} />}
            {pageNumber === 2 && <LeaderBoards />}
            {pageNumber === 3 && <GameSettings changePageNumber={changePageNumber} />}
            {pageNumber === 4 && 
                <GameSetup 
                    gameMode={gameMode} 
                    course={gameData} 
                    setUpGame={setUpGame} 
                    handleCancel={() => setPageNumber(3)} 
                    networkRequest={networkRequest}
                    setShowHolesContestsModal={setShowHolesContestsModal} />}
            {pageNumber === 5 && <CourseSetup gameMode={gameMode} data={ongoingRound} handleSaveCourseSetting={handleSaveCourseSetting} handleCancel={() => setPageNumber(3)}  />}
			<ConfirmDialog
				show={showConfirmModal}
				handleClose={handleCloseModal}
				handleConfirm={handleConfirm}
				message={displayMsg}
			/>
            <HolesContestsDialog
                show={showHolesContestsModal}
                handleClose={handleCloseModal}
                data={holesContestData}
                updateHolesContest={updateHolesContest}
            />
        </section>
    )
}

export default GameBoard;