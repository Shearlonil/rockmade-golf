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
import OffcanvasMenu from '../../../../Components/OffcanvasMenu';
import { OrbitalLoading } from '../../../../Components/react-loading-indicators/Indicator';
import GroupScore from './GroupScore';
import LeaderBoards from './LeaderBoards';
import GameSettings from './GameSettings';
import CourseSetup from '../../../../Components/CourseSetup';
import { useActiveCourses } from '../../../../app-context/active-courses-context';
import ConfirmDialog from '../../../../Components/DialogBoxes/ConfirmDialog';
import GameSetup from '../../../../Components/GameSetup';
import useGenericController from '../../../../api-controllers/generic-controller-hook';
import useCourseController from '../../../../api-controllers/course-controller-hook';
import useGameController from '../../../../api-controllers/game-controller-hook';

const GameBoard = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const { setCourses, setLoading } = useActiveCourses();
    const { logout } = useAuth();
    const { gameCourseSearch,  } = useCourseController();
    const { performGetRequests } = useGenericController();
    const { updateGameContests, updateGame } = useGameController();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
    const [showOrbitalLoader, setShowOrbitalLoader] = useState(false);
    // course data
    const [ongoingRound, setOngoingRound] = useState(null);
    const [courseId, setCourseId] = useState(0);
    // Game data
    const [gameContests, setGameContests] = useState([]); // new contests to send to backend  
    const [playerScores, setPlayerScores] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [gameMode, setGameMode] = useState(null);
    
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");
    const [confirmDialogEvtName, setConfirmDialogEvtName] = useState(null);
    const [updatedCourseData, setUpdatedCoureData] = useState(null);

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
            setShowOrbitalLoader(true);
            resetAbortController();
            const urls = [ `/games/rounds/ongoing/${id}`, `/courses/games/init/10` ];
            const response = await performGetRequests(urls, controllerRef.current.signal);
            const { 0: ongoingRoundsReq, 1: coursesReq } = response;

            if(ongoingRoundsReq && ongoingRoundsReq.data){
                const game = ongoingRoundsReq.data.game;
                // overwrite the Course prop in game object returned from backend
                game.Course = ongoingRoundsReq.data.course;
                setOngoingRound(game);
                setCourseId(game.course_id);
                switch (game.mode) {
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
                setLoading(false);
            }
            setNetworkRequest(false);
            setShowOrbitalLoader(false);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            setShowOrbitalLoader(false);
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

    const asyncCourseSearch = async (inputValue, callback) => {
        /*  refs: https://stackoverflow.com/questions/65963103/how-can-i-setup-react-select-to-work-correctly-with-server-side-data-by-using  */
        try {
            setNetworkRequest(true);
            resetAbortController();
            const response = await gameCourseSearch(controllerRef.current.signal, inputValue);
            const results = response.data.map(course => ({label: course.name, value: course}));
            setCourses(response.data);
            setNetworkRequest(false);
            callback(results);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const handleSaveCourseSetting = (data) => {
        setConfirmDialogEvtName('save')
        setDisplayMsg('Update Course for the ongoing game?');
        setShowConfirmModal(true);
        setUpdatedCoureData(data);
    }

    const handleUpdateGameContests = async () => {
        setConfirmDialogEvtName('updateHoleContests')
        setDisplayMsg('Update Game with new contests?');
        setShowConfirmModal(true);
    };

	const handleCloseModal = () => {
        setShowConfirmModal(false);
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
                break;
            case 'updateHoleContests':
                saveUpdatedHolesContests();
                break;
        }
    };
    
    const setHolesContests = (arr) => {
        setGameContests(arr);
    }

    const updateGameCourse = async () => {
        try {
            setNetworkRequest(true);
            setShowOrbitalLoader(true);
            resetAbortController();
            const data = {
                game_id: id,
                startDate: updatedCourseData.startDate,
                course_id: updatedCourseData.course.value.id,
                hole_mode: updatedCourseData.hole_mode.value,
                name: updatedCourseData.name,
            };
            await updateGame(controllerRef.current.signal, data);
            setConfirmDialogEvtName(null);
            setNetworkRequest(false);
            setShowOrbitalLoader(false);
            toast.info('Update successful');
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            setShowOrbitalLoader(false);
            toast.error(handleErrMsg(error).msg);
        }
    }

    const saveUpdatedHolesContests = async () => {
        try {
            resetAbortController();
            setNetworkRequest(true);
            setShowOrbitalLoader(true);
            const data = {
                game_id: id,
                course_id: courseId,
                contests: gameContests 
            }
            await updateGameContests(controllerRef.current.signal, data);
            setNetworkRequest(false);
            setShowOrbitalLoader(false);
            toast.info('Update successful');
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            setShowOrbitalLoader(false);
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
                        <span className="fw-bold text-success h4">{ongoingRound?.Course.name}</span>
                    </div>

                    <div className="d-flex flex-column gap-1 align-items-center justify-content-center col-12 col-md-4">
                        <IoSettings size={35} style={{ color: 'blue' }} onClick={() => setPageNumber(3)} />
                        <span className="fw-bold h6">Settings</span>
                    </div>
                </div>
            </Row>
            <div className="justify-content-center d-flex">
                {showOrbitalLoader && <OrbitalLoading color='red' />}
            </div>
            {pageNumber === 1 && <GroupScore holeMode={ongoingRound?.hole_mode} playerScores={playerScores} />}
            {pageNumber === 2 && <LeaderBoards />}
            {pageNumber === 3 && <GameSettings changePageNumber={changePageNumber} />}
            {pageNumber === 4 && 
                <GameSetup 
                    gameMode={gameMode} 
                    data={ongoingRound} 
                    setUpGame={handleUpdateGameContests} 
                    handleCancel={() => setPageNumber(3)} 
                    networkRequest={networkRequest}
                    setHolesContests={setHolesContests} />}
            {pageNumber === 5 && 
                <CourseSetup 
                    gameMode={gameMode} 
                    data={ongoingRound} 
                    handleSaveCourseSetting={handleSaveCourseSetting} 
                    handleCancel={() => setPageNumber(3)} 
                    asyncCourseSearch={asyncCourseSearch} />}
			<ConfirmDialog
				show={showConfirmModal}
				handleClose={handleCloseModal}
				handleConfirm={handleConfirm}
				message={displayMsg}
			/>
        </section>
    )
}

export default GameBoard;