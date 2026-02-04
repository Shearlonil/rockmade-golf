import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IoSettings } from "react-icons/io5";
import { IoMdRefreshCircle } from "react-icons/io";
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
import PlayerSelection from '../../../../Components/PlayerSelection';
import GameCodesViewDialog from '../../../../Components/DialogBoxes/GameCodesViewDialog';
import { UserScore } from '../../../../Entities/UserScore';

const GameBoard = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const { setCourses, setLoading } = useActiveCourses();
    const { logout } = useAuth();
    const { gameCourseSearch,  } = useCourseController();
    const { performGetRequests } = useGenericController();
    const { updateGameSpices, updateGame, updateGroupScores } = useGameController();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
    const [showOrbitalLoader, setShowOrbitalLoader] = useState(false);
    // course data
    const [ongoingRound, setOngoingRound] = useState(null);
    const [courseId, setCourseId] = useState(0);
    // Game data
    const [gameContests, setGameContests] = useState([]); // new contests to send to backend
    const [rounds, setRounds] = useState(1); // new rounds to send to backend
    const [playerScores, setPlayerScores] = useState([]);
    // variable to note the group of user
    const [myGroup, setMyGroup] = useState(null);
    const [gameGroupArr, setGameGroupArr] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [gameMode, setGameMode] = useState(null);
    // column headers for table displayed in GroupScore component
    const [columns, setColumns] = useState([
        {
            key: 'name',
            label: 'Name',
            fixed: true,
            // flexGrow: 5,
            width: 170,
        },
        {
            key: 'toParVal',
            label: '',
            fixed: true,
            // flexGrow: 1,
            width: 80,
        },
    ]);
    const [holeProps, setHoleProps] = useState();
    
	const [showGameCodesModal, setShowGameCodesModal] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");
    const [confirmDialogEvtName, setConfirmDialogEvtName] = useState(null);
    const [updatedCourseData, setUpdatedCoureData] = useState(null);
    
    const offCanvasMenu = [
        { label: "Enter Score", onClickParams: {evtName: 'enterScore'} },
        { label: "Leaderboards", onClickParams: {evtName: 'leaderboards'} },
        { label: "Settings", onClickParams: {evtName: 'settings'} },
        { label: "Share Game", onClickParams: {evtName: 'share'} },
    ];
    const [activeMenuItem, setActiveMenuItem] = useState(offCanvasMenu[0].label);

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
                const hp = buildHoleProps(game.Course);
                buildGameGroup(game, hp);
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
            if(error.response.status === 404){
                navigate('/dashboard')
            }
            setNetworkRequest(false);
            setShowOrbitalLoader(false);
            toast.error(handleErrMsg(error).msg);
        }
    }

	const handleOffCanvasMenuItemClick = async (menus, e) => {
		switch (menus.onClickParams.evtName) {
            case 'enterScore':
                setPageNumber(1);
                setActiveMenuItem(menus.label);
                break;
            case 'leaderboards':
                setPageNumber(2);
                setActiveMenuItem(menus.label);
                break;
            case 'settings':
                setPageNumber(3);
                setActiveMenuItem(menus.label);
                break;
            case 'share':
                setShowGameCodesModal(true);
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
        setConfirmDialogEvtName('updateHoleContests');
        setDisplayMsg('Update Game with new contests and rounds?');
        setShowConfirmModal(true);
    };

	const handleCloseModal = () => {
        setShowConfirmModal(false);
        setShowGameCodesModal(false);
    };

    const settingsClicked = () => {
        setPageNumber(3);
        setActiveMenuItem("Settings");
    };

    const refreshClicked = () => {};

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
    
    const setNewRounds = (round) => {
        setRounds(round);
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
            const response = await updateGame(controllerRef.current.signal, data);
            if(response && response.data){
                const game = response.data.g;
                game.Course = response.data.course;
                setOngoingRound(game);
            }
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
                contests: gameContests,
                rounds
            }
            await updateGameSpices(controllerRef.current.signal, data);
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

	const buildGameGroup = (game, holeProps) => {
        const decrypted_id = cryptoHelper.decryptData(user.id);
        let myGroupHolder = 0;
        const groupScores = [];
        const arr = [];
        game.users.forEach(user => {
            if(user.id == decrypted_id){
                setMyGroup(user.UserGameGroup.name);
                // temporary store group of current user
                myGroupHolder = user.UserGameGroup.name;
            }
            if(user.UserGameGroup.round_no === game.current_round){
                const group = arr.find(g => g.name === user.UserGameGroup.name);
                if(group){
                    group.members.push(user);
                }else {
                    arr.push({
                        name: user.UserGameGroup.name,
                        members: [user]
                    });
                }
            }
        });
        // get group of current user to build playerScores for the group
        const group = arr.find(g => g.name === myGroupHolder);
        // group.members.forEach(member => groupScores.push({
        //     id: member.id,
        //     hcp: member.hcp,
        //     ProfileImgKeyhash: member.ProfileImgKeyhash,
        //     name: member.fname + ' ' + member.lname,
        //     toParVal: '',
        // }));
        group.members.forEach(member => {
            const userScore = new UserScore();
            userScore.id = member.id;
            userScore.hcp = member.hcp,
            userScore.ProfileImgKeyhash = member.ProfileImgKeyhash,
            userScore.name = member.fname + ' ' + member.lname,
            groupScores.push(userScore);
        });
        switch (game.hole_mode) {
            case 1:
                buildGroupScoreTableColumns(1, 18, groupScores, holeProps);
                break;
                case 2:
                buildGroupScoreTableColumns(1, 9, groupScores, holeProps);
                break;
            case 3:
                buildGroupScoreTableColumns(10, 18, groupScores, holeProps);
                break;
            }

        const currentRoundScores = game.GameHoleRecords.filter(ghc => ghc.round_no === game.current_round);
        buildGroupCuurentRoundScores(groupScores, currentRoundScores);
        setGameGroupArr(arr);
        setPlayerScores(groupScores);
    };

    const buildHoleProps = (course) => {
        const obj = {};
        course.holes.forEach(hole => {
            const hole_no = hole.hole_no;
            obj[hole_no] = {
                hcp_idx: hole.CourseHoles.hcp_idx,
                par: hole.CourseHoles.par
            }
        });
        setHoleProps(obj);
        return obj;
    };

    const resetAbortController = () => {
        // Cancel previous request if it exists
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
    };

    const buildGroupScoreTableColumns = (start, end, groupScores, holeProps) => {
        const arr = [];
        for(let i = start; i <= end; i++){
            arr.push({
                key: i,
                label: i,
                width: 70,
            });
            groupScores.forEach(groupScore => groupScore.setHolePar(i, holeProps[i].par) );
        }
        setColumns([...columns, ...arr]);
    };

    const buildGroupCuurentRoundScores = (groupScores, gameHoleRec) => {
        gameHoleRec.forEach(ghc => {
            ghc.UserHoleScores.forEach(uhs => {
                const found = groupScores.find(gs => gs.id === uhs.user_id);
                if(found){
                    const hole_no = ghc.hole_no;
                    // found[hole_no] = uhs.score;
                    found.setHoleScore(hole_no, uhs.score);
                }
            });
        });
    };

    return (
        <section className='container d-flex flex-column gap-4' style={{minHeight: '80vh'}}>
            <OffcanvasMenu menuItems={offCanvasMenu} menuItemClick={handleOffCanvasMenuItemClick} variant='danger' activeMenuItem={activeMenuItem} />
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

                    <div className='d-flex col-12 col-md-4 gap-4 align-items-center justify-content-center'>
                        <div className="d-flex flex-column gap-1 align-items-center">
                            <IoSettings size={35} style={{ color: 'blue' }} onClick={ settingsClicked } />
                            <span className="fw-bold h6">Settings</span>
                        </div>

                        <div className="d-flex flex-column gap-1 align-items-center">
                            <IoMdRefreshCircle size={35} style={{ color: 'red' }} onClick={ refreshClicked } />
                            <span className="fw-bold h6">Refresh</span>
                        </div>
                    </div>
                </div>
            </Row>
            <div className="justify-content-center d-flex">
                {showOrbitalLoader && <OrbitalLoading color='red' />}
            </div>
            {pageNumber === 1 && <GroupScore playerScores={playerScores} columns={columns} holeProps={holeProps} game_id={ongoingRound?.id} />}
            {pageNumber === 2 && <LeaderBoards />}
            {pageNumber === 3 && <GameSettings changePageNumber={changePageNumber} networkRequest={networkRequest} />}
            {pageNumber === 4 && 
                <GameSetup 
                    gameMode={gameMode} 
                    data={ongoingRound} 
                    setUpGame={handleUpdateGameContests} 
                    handleCancel={() => setPageNumber(3)} 
                    networkRequest={networkRequest}
                    setHolesContests={setHolesContests}
                    setRounds={setNewRounds} />}
            {pageNumber === 5 && 
                <CourseSetup 
                    gameMode={gameMode} 
                    data={ongoingRound} 
                    handleSaveCourseSetting={handleSaveCourseSetting} 
                    handleCancel={() => setPageNumber(3)} 
                    asyncCourseSearch={asyncCourseSearch} />}
            {pageNumber === 6 && <PlayerSelection changePageNumber={changePageNumber} gameGroupArr={gameGroupArr} game={ongoingRound} />}
			<ConfirmDialog
				show={showConfirmModal}
				handleClose={handleCloseModal}
				handleConfirm={handleConfirm}
				message={displayMsg}
			/>

            <GameCodesViewDialog
				show={showGameCodesModal}
				handleClose={handleCloseModal}
				codes={ongoingRound?.GameCode}
			/>
        </section>
    )
}

export default GameBoard;