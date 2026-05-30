import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { Row } from 'react-bootstrap';
import { format } from 'date-fns';
import { IoSettings } from "react-icons/io5";
import { IoMdRefreshCircle } from "react-icons/io";
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../../app-context/auth-context';
import useGenericController from '../../../api-controllers/generic-controller-hook';
import useGameController from '../../../api-controllers/game-controller-hook';
import { useGame } from '../../../app-context/game-context';
import { useAuthUser } from '../../../app-context/user-context';
import handleErrMsg from '../../../Utils/error-handler';
import { buildGameScores, buildHoleProps } from '../../../Utils/game-builder';
import LeaderBoards from './game-board/LeaderBoards';
import cryptoHelper from '../../../Utils/crypto-helper';
import IMAGES from '../../../assets/images';
import { OrbitalLoading } from '../../../Components/react-loading-indicators/Indicator';

const cols = [
    {
        key: 'name',
        label: 'Name',
        fixed: true,
        // flexGrow: 5,
        width: 160,
    },
    {
        key: 'toParVal',
        label: '',
        fixed: true,
        // flexGrow: 1,
        width: 60,
    },
];

const ViewGame = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();
    const { nano_id } = useParams();

    const { logout } = useAuth();
    const { performGetRequests } = useGenericController();
    const { updateGameSpices, updateGame, endOngoingGame } = useGameController();
    const { gamePlay, setGamePlay, setScores, setGroups, setHoleProps, setPlayerID } = useGame();
    const { authUser } = useAuthUser();
    const ongoingRound = gamePlay();
    const user = authUser();
    
    const [networkRequest, setNetworkRequest] = useState(false);
    const [showOrbitalLoader, setShowOrbitalLoader] = useState(false);

    // variable to note the group of user
    const [myGroup, setMyGroup] = useState(null);
    const [gameMode, setGameMode] = useState(null);
    // column headers for table displayed in GroupScore component
    const [columns, setColumns] = useState(cols);
    
    useEffect(() => {
        if(!user || cryptoHelper.decryptData(user.mode) !== '1'){
            logoutUnauthorized();
        }
        
        initialize();
        return () => {
            // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
            controllerRef.current.abort();
            setScores([]);
            setGamePlay(null);
        };
    }, [location.pathname]);

    const initialize = async () => {
        try {
            setScores([]);
            setNetworkRequest(true);
            setShowOrbitalLoader(true);
            resetAbortController();
            const urls = [ `/games/rounds/ongoing/${nano_id}` ];
            const response = await performGetRequests(urls, controllerRef.current.signal);
            const { 0: ongoingRoundsReq } = response;

            if(ongoingRoundsReq && ongoingRoundsReq.data){
                const game = ongoingRoundsReq.data.game;
                game.Course = ongoingRoundsReq.data.course;
                setGamePlay(game);
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
                
                const decrypted_id = cryptoHelper.decryptData(user.id);
                const hp = buildHoleProps(game);
                setHoleProps(hp);
                const gameScoresObj = buildGameScores(game, hp, decrypted_id);
                setGroups(gameScoresObj.groupsArr);
                setScores(gameScoresObj.allScores);
                setMyGroup(gameScoresObj.myGroup);
                setColumns([...cols, ...gameScoresObj.colsArr]);
            }
            setNetworkRequest(false);
            setShowOrbitalLoader(false);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            if(error.response?.status === 404){
                navigate('/dashboard')
            }
            setNetworkRequest(false);
            setShowOrbitalLoader(false);
            toast.error(handleErrMsg(error).msg);
        }
    }

    const refreshClicked = () => { initialize(); };

    const resetAbortController = () => {
        // Cancel previous request if it exists
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
    };

    return (
        <section className='container d-flex flex-column gap-4' style={{minHeight: '80vh'}}>
            <Row className="card shadow border-0 rounded-3 mt-5">
                <div className="card-body row ms-0 me-0 d-flex justify-content-between">
                    <div className="d-flex gap-3 align-items-center justify-content-center col-12 col-md-4 mb-3">
                        <img src={IMAGES.golf_course} alt ="Avatar" className="rounded-circle" width={50} height={50} />
                        <div className="d-flex flex-column gap-1">
                            <span className="text-danger fw-bold h2"> {ongoingRound?.name} </span>
                            <span className="text-success fw-bold">{ongoingRound && ongoingRound.createdAt && format(ongoingRound.createdAt, "dd/MM/yyyy")}</span>
                        </div>
                    </div>

                    <div className="d-flex flex-column gap-1 align-items-center justify-content-center col-12 col-md-4">
                        <span className="fw-bold h6">Location</span>
                        <span className="fw-bold text-success h4">{ongoingRound?.Course?.name}</span>
                    </div>

                    <div className='d-flex col-12 col-md-4 gap-4 align-items-center justify-content-center'>
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
            <LeaderBoards networkRequest={networkRequest} />
        </section>
    )
}

export default ViewGame;