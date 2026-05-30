import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../../app-context/auth-context';
import useGenericController from '../../../api-controllers/generic-controller-hook';
import useGameController from '../../../api-controllers/game-controller-hook';
import { useGame } from '../../../app-context/game-context';
import { useAuthUser } from '../../../app-context/user-context';

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
    
    useEffect(() => {
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
                
                const hp = buildHoleProps(game);
                buildGameScores(game, hp);
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
    
    const buildGameScores = (game, holeProps) => {
        const decrypted_id = cryptoHelper.decryptData(user.id);
        const allScores = [];
        const arr = [];
        game.users.forEach(user => {
            if(user.id == decrypted_id){
                setMyGroup(user.UserGameGroup.name);
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
            const userScore = new UserScore();
            userScore.id = user.id;
            userScore.nano_id = user.nano_id;
            userScore.hcp = user.UserGameGroup.user_hcp;
            userScore.ProfileImgKeyhash = user.ProfileImgKeyhash;
            userScore.name = user.fname + ' ' + user.lname;
            userScore.group = user.UserGameGroup.name;
            userScore.hole_mode = game.hole_mode;
            allScores.push(userScore);
        });
        switch (game.hole_mode) {
            case 1:
                buildGroupScoreTableColumns(1, 18, allScores, holeProps);
                break;
            case 2:
                buildGroupScoreTableColumns(1, 9, allScores, holeProps);
                break;
            case 3:
                buildGroupScoreTableColumns(10, 18, allScores, holeProps);
                break;
        }

        const currentRoundScores = game.GameHoleRecords.filter(ghc => ghc.round_no === game.current_round);
        buildCurrentRoundScores(allScores, currentRoundScores);
        setGroups(arr);
        setScores(allScores);
    };

    const buildHoleProps = (game) => {
        const obj = {};
        game.Course.holes.forEach(hole => {
            const hole_no = hole.hole_no;
            obj[hole_no] = {
                hcp_idx: hole.CourseHoles.hcp_idx,
                par: hole.CourseHoles.par,
            }
            // is contest attached to this hole for game play during game setup?
            const ghc = game.GameHoleContests.find(holeContest => holeContest.hole_id === hole.id);
            // if contest found
            if(ghc) {
                // get the contest (with details including the name) from course hole
                const contest = hole.contests.find(contest => contest.id === ghc.contest_id);
                if(contest){
                    obj[hole_no].contest = {
                        id: contest.id,
                        name: contest.name,
                    }
                }
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

    return (
        <div>ViewGame</div>
    )
}

export default ViewGame;