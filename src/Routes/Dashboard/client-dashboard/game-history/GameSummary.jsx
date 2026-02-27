import { useState, useRef, useEffect } from "react";
import { Row } from "react-bootstrap";
import { format } from "date-fns";
import Skeleton from "react-loading-skeleton";

import IMAGES from "../../../../assets/images";
import useGameController from "../../../../api-controllers/game-controller-hook";
import cryptoHelper from "../../../../Utils/crypto-helper";
import { useAuth } from "../../../../app-context/auth-context";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuthUser } from "../../../../app-context/user-context";
import handleErrMsg from "../../../../Utils/error-handler";
import { toast } from "react-toastify";
import { useGame } from "../../../../app-context/game-context";
import { UserScore } from "../../../../Entities/UserScore";
import ScoreCard from "../../../../Components/ScoreCard";
import ImageComponent from "../../../../Components/ImageComponent";
import LeaderBoards from "../game-board/LeaderBoards";
import PlayerList from "./PlayerList";

const GameSummary = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const { logout } = useAuth();
    const { authUser } = useAuthUser();
    const { setScores, setGamePlay, setHoleProps, holeProps, scores, player_id, setGameOrganizer } = useGame();
    const { findRecentGameById } = useGameController();
    const user = authUser();
    const playerScores = scores();
    const playerID = player_id();
    const hp = holeProps();

    const [networkRequest, setNetworkRequest] = useState(true);
    const [recentGame, setRecentGame] = useState(null);
    const [gameMode, setGameMode] = useState(null);
    const [userOfInterestScore, setUserOfInterestScore] = useState(null);
    const [totalPar, setTotalPar] = useState(0);
    const [scoreCardTableData, setScoreCardTableData] = useState([]);
    // column headers for table displayed in GroupScore component
    const [columns, setColumns] = useState([
        {
            key: 'txtScore',
            label: 'Hole',
            fixed: true,
            width: 70
        },
    ]);
    
    useEffect(() => {
        if(!user || cryptoHelper.decryptData(user.mode) !== '1' || !playerID){
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

    const logoutUnauthorized = async () => {
        setNetworkRequest(true);
        await logout();
        navigate("/");
    }

    const initialize = async () => {
        try {
            setScores([]);
            setNetworkRequest(true);
            resetAbortController();
            const response = await findRecentGameById(controllerRef.current.signal, id);

            if(response && response.data){
                const game = response.data.game;
                game.Course = response.data.course;
                setRecentGame(game);
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
                
                const hp = buildHoleProps(game);
                buildGameScores(game, hp);
            }
            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            if(error.response.status === 404){
                navigate('/dashboard')
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    }

    const resetAbortController = () => {
        // Cancel previous request if it exists
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
    };
    
        const buildGameScores = (game, holeProps) => {
            const decrypted_id = cryptoHelper.decryptData(user.id);
            const allScores = [];
            // const arr = [];
            game.users.forEach(user => {
                const userScore = new UserScore();
                userScore.id = user.id;
                userScore.hcp = user.UserGameGroup.user_hcp;
                userScore.ProfileImgKeyhash = user.ProfileImgKeyhash;
                userScore.name = user.fname + ' ' + user.lname;
                userScore.group = user.UserGameGroup.name;
                allScores.push(userScore);
                if(user.id == playerID){
                    setScoreCardTableData([userScore]);
                    // player of interest....
                    setUserOfInterestScore(userScore);
                }
                if(user.id == game.creator_id){
                    setGameOrganizer(userScore);
                }
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
            // set positions
            allScores.sort((a, b) => (a.lbParVal - b.lbParVal) || (a.hcp - b.hcp)).forEach((score, idx) => score.position = idx + 1);
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

    const buildGroupScoreTableColumns = (start, end, allScores, holeProps) => {
        const arr = [];
        let totalPar = 0;
        for(let i = start; i <= end; i++){
            totalPar += holeProps[i]?.par
            arr.push({
                key: i,
                label: i,
                width: 70,
            });
            allScores.forEach(groupScore => groupScore.setHolePar(i, holeProps[i].par) );
        }
        setTotalPar(totalPar);
        setColumns([...columns, ...arr]);
    };

    const buildCurrentRoundScores = (allScores, gameHoleRec) => {
        gameHoleRec.forEach(ghc => {
            ghc.UserHoleScores.forEach(uhs => {
                const found = allScores.find(gs => gs.id === uhs.user_id);
                if(found){
                    const hole_no = ghc.hole_no;
                    // found[hole_no] = uhs.score;
                    found.setHoleScore(hole_no, uhs.score);
                }
            });
            ghc.UserHoleContestScores.forEach(uhcs => {
                const found = allScores.find(gs => gs.id === uhcs.user_id);
                if(found){
                    const hole_no = ghc.hole_no;
                    found.setHoleContestScore(hole_no, uhcs.score);
                }
            });
        });
    };

    return (
        <section className='container d-flex flex-column gap-4' style={{minHeight: '80vh'}}>
            <Row className="card shadow border-0 rounded-3 mt-5">
                <div className="card-body row ms-0 me-0 d-flex justify-content-between">
                    <div className="d-flex gap-3 align-items-center justify-content-center col-12 col-md-4 mb-3">
                        <img src={IMAGES.golf_course} alt ="Avatar" className="rounded-circle" width={50} height={50} />
                        {!networkRequest && <div className="d-flex flex-column gap-1">
                            <span className="text-danger fw-bold h2"> {recentGame?.name} </span>
                            <span className="text-success fw-bold">{recentGame && recentGame.createdAt && format(recentGame.createdAt, "dd/MM/yyyy")}</span>
                        </div>}
                        {networkRequest && <div className="d-flex flex-column gap-1">
                            <Skeleton count={2} style={{width: '100%'}} />
                        </div>}
                    </div>

                    <div className="d-flex flex-column gap-1 align-items-center justify-content-center col-12 col-md-4">
                        <span className="fw-bold h6">Location</span>
                        {!networkRequest && <span className="fw-bold text-success h4">{recentGame?.Course.name}</span>}
                        {networkRequest && <div className="d-flex flex-column gap-1">
                            <Skeleton count={1} style={{width: '100%'}} />
                        </div>}
                    </div>
                </div>
            </Row>

            <Row className='mt-4'>
                <div className="d-flex flex-wrap gap-4 align-items-center justify-content-center col-md-10 col-sm-12" >
                    {userOfInterestScore?.ProfileImgKeyhash && <ImageComponent image={userOfInterestScore?.ProfileImgKeyhash} width={'100px'} height={'100px'} round={true} key_id={userOfInterestScore?.ProfileImgKeyhash.key_hash} />}
                    {!userOfInterestScore?.ProfileImgKeyhash && <img src={IMAGES.member_icon} alt ="Avatar" className="rounded-circle" width={100} height={100} />}
                    <div className="d-flex flex-column">
                        <span className="fw-bold h2">{userOfInterestScore?.name}</span>
                        <div> HCP: <span>{userOfInterestScore?.hcp}</span> </div>
                    </div>
                </div>
            </Row>

            <div className="mt-1 d-flex flex-column">
                <span className="fw-bold">
                    Scorecard
                </span>
                <ScoreCard columns={columns} holeProps={hp} totalPar={totalPar} player={userOfInterestScore} tableData={scoreCardTableData} />
            </div>

            <Row className='mb-5'>
                <div className="col-md-6 col-sm-12 mb-5">
                    <span className="h2 text-danger fw-bold d-flex justify-content-center">Leaderboards</span>
                    <div className="border-1 shadow rounded-3 p-2" style={{maxHeight: 500, overflowY: 'scroll'}}>
                        <LeaderBoards networkRequest={networkRequest} />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12 mb-5">
                    <span className="h2 text-primary fw-bold d-flex justify-content-center">Players ({playerScores?.length})</span>
                    <div className="border-1 shadow rounded-3 p-2" style={{maxHeight: 500, overflowY: 'scroll'}}>
                        <PlayerList networkRequest={networkRequest} />
                    </div>
                </div>
            </Row>
        </section>
    );
}

export default GameSummary;