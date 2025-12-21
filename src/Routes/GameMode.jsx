import { useEffect, useRef, useState } from "react";
import {
    Button,
    Row,
    Col,
    Container,
    Modal,
    ToggleButton,
    ButtonGroup,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { isAfter } from 'date-fns';

import { GameModeCard } from "../Styles/HomeStyle";
import HeroComp from "../Components/HeroComp";
import IMAGES from "../assets/images";
import crypt from "../Utils/crypto-helper";
import { gameModes } from "../Utils/data";
import handleErrMsg from '../Utils/error-handler';
import { useAuthUser } from "../app-context/user-context";
import useCourseController from "../api-controllers/course-controller-hook";
import useGameController from "../api-controllers/game-controller-hook";
import CourseSetup from "../Components/CourseSetup";
import { useActiveCourses } from "../app-context/active-courses-context";
import GameSetup from "../Components/GameSetup";
import PlayerSelection from "../Components/PlayerSelection";

const GameMode = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { setCourses, setLoading } = useActiveCourses();
    const { limitGameCourseSearch, gameCourseSearch } = useCourseController();
    const { createGame } = useGameController();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [step, setStep] = useState(1);
    
    const [networkRequest, setNetworkRequest] = useState(false);
	const [courseSettingData, setCourseSettingData] = useState(null);
    
    // Global states for selections
    const [gameMode, setGameMode] = useState("");
    const [course, setCourse] = useState({});
    const [gameGroupArr, setGameGroupArr] = useState([]);
    const [ongoingRound, setOngoingRound] = useState(null);
    const [heroText, setHeroText] = useState("Our Game Modes");
    const [gameFormat, setGameFormat] = useState("Stroke Play");
    const [features, setFeatures] = useState({});

    // players: slot contains either null or a player object {name,image,handicap,tee}
    const [players, setPlayers] = useState([user, null, null, null]); // 4 slots
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // live scores state: array of arrays: scores[playerIndex][holeIdx] = string/number
    const holeCount = 18;
    const [scores, setScores] = useState(() => players.map(() => Array(holeCount).fill("")) );

    // editMode: 'own' (default) or 'all' (host/scorekeeper)
    const [editMode, setEditMode] = useState("own");

    useEffect(() => {
        if(user && crypt.decryptData(user.mode) === '0'){
            // staff now allowed, because user.sub for staff will be undefined
            toast.info("Only subscribed memebers are allowed to create games");
            // navigate to dashboard
            navigate('/dashboard');
            return;
        }
        if(user && user.sub && isAfter(new Date(), new Date(crypt.decryptData(user.sub)).setHours(23, 59, 59, 0))){
            // navigate to sub page
            navigate('/memberships');
            return;
        }
        // Cancel any previous in-flight request
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        initialize();

        return () => {
            // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
            controllerRef.current.abort();
        };
    }, [location.pathname]);

    const initialize = async () => {
        try {
            controllerRef.current = new AbortController();
            setNetworkRequest(true);
            const response = await limitGameCourseSearch(controllerRef.current.signal, 10);
            setCourses(response.data);
            setLoading(false);

            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    }

    const handleScoreChange = (playerIdx, holeIdx, raw) => {
        // sanitize: allow only non-negative integers or empty string
        let v = raw === "" ? "" : parseInt(raw, 10);
        if (!Number.isFinite(v)) v = "";
        if (v !== "" && v < 0) v = 0;
        setScores((prev) => {
            const copy = prev.map((r) => [...r]);
            if (!copy[playerIdx]) copy[playerIdx] = Array(holeCount).fill("");
            copy[playerIdx][holeIdx] = v === "" ? "" : String(v);
            return copy;
        });
    };

	const submitCourse = (data) => {
        setCourse(data);
        setCourseSettingData(data);
        setHeroText('Add Contests to spice up game');
        setStep(3);
    };

    const setHolesContests = (arr) => {
        const c = {...course};
        c.contests = arr;
        setCourse(c);
        setCourseSettingData(c);
    }

    const setUpGame = async () => {
        try {
            // Cancel previous request if it exists
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
            controllerRef.current = new AbortController();
            setNetworkRequest(true);
            const data = {
                contests: course.contests,
                startDate: course.startDate,
                course_id: course.course.value.id,
                hole_mode: course.hole_mode.value,
                name: course.name,
                mode: gameMode.id
            };
            const response = await createGame(controllerRef.current.signal, data);
            setOngoingRound(response.data);
            buildGameGroup(response.data);
            setHeroText('Create Groups and Add Players');
            setStep(4);
            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

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

    const saveScores = () => {
        // implement persist to backend here
        alert("Scores saved (console logged).");
    };

    const resetScores = () => {
        setScores(players.map(() => Array(holeCount).fill("")));
    };

    // helper: find current user's slot index in players (by name)
    const viewerSlotIndex = players.findIndex((p) => p && p.name === user.name);

	const buildGameGroup = (game) => {
        const arr = [];
        game.users.forEach(user => {
            if(user.UserGameGroup.round_no === game.current_round){
                const group = arr.find(g => g.name === user.UserGameGroup.name);
                if(group){
                    group.members.push(user);
                }else {
                    arr.push({
                        name: user.UserGameGroup.name,
                        members: [user]
                    })
                }
            }
        });
        setGameGroupArr(arr);
    };

    const resetAbortController = () => {
        // Cancel previous request if it exists
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
    };

    return (
        <>
            <HeroComp $heroImage={IMAGES.image4}>
                <h2 className="text-center mb-4 display-5 fw-bold"> { heroText }</h2>
            </HeroComp>

            <Container className="mt-5" id="section_3">
                {/* small progress bar (optional: insert above content) */}
                <div className="mb-4">
                    <h5 className="fw-bold">Setup Progress</h5>
                    <div className="progress" style={{ height: "20px", borderRadius: "10px" }} >
                        <div
                              className={`progress-bar ${step === 5 ? "bg-success" : "bg-info"} progress-bar-striped progress-bar-animated`}
                              role="progressbar"
                              style={{width: `${(step / 5) * 100}%`,transition: "width 0.5s ease",}}
                        >
                            {Math.round((step / 5) * 100)}%
                        </div>
                    </div>
                </div>

                {step === 1 && (
                    <div className="text-center mb-5">
                        <h2 className="mb-4">Choose Game Mode</h2>
                        <Row>
                            {gameModes.map((mode, index) => (
                                <Col key={index} md={4} className="mb-4"
                                    onClick={() => {
                                        setGameMode(mode);
                                        setStep(2); // move immediately to next step
                                        setHeroText('Golf Course Selection & Holes');
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <GameModeCard bg={mode.image} className={gameMode === mode.name ? "border border-danger border-2" : "" } >
                                        <div className="overlay d-flex flex-column justify-content-center align-items-center">
                                            <h2>{mode.name}</h2>
                                            <p>{mode.desc}</p>
                                        </div>
                                    </GameModeCard>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

                {step === 2 && 
                    <CourseSetup 
                        data={courseSettingData} 
                        gameMode={gameMode.name} 
                        handleSaveCourseSetting={submitCourse} 
                        asyncCourseSearch={asyncCourseSearch}
                        handleCancel={() => {
                            setStep(1);
                            setHeroText('Our Game Modes');
                        }} 
                        btnRedText='Back' btnBlueText='Next' />}
                {step === 3 && 
                    <GameSetup 
                        gameMode={gameMode.name} 
                        data={course} 
                        setUpGame={setUpGame} 
                        handleCancel={() => {
                            setStep(2);
                            setHeroText('Golf Course Selection & Holes');
                        }} 
                        networkRequest={networkRequest}
                        btnRedText={'Back'}
                        setHolesContests={setHolesContests} />}

                {step === 4 && <PlayerSelection gameGroupArr={gameGroupArr} game={ongoingRound} />}

                {/* ---------- STEP 5: Live Game / Single Editable Table ---------- */}
                {step === 5 && (
                    <div className="p-5 border rounded-4 bg-light shadow">
                        <div className="text-center mb-3">
                            <h2 className="fw-bold text-success">Game In Progress</h2>
                            <p className="text-muted mb-2">
                                {course} • {holeCount} Holes • {gameFormat}
                            </p>

                            {/* edit mode toggle */}
                            <div className="d-flex justify-content-center align-items-center gap-3">
                                <small className="text-muted">Edit mode:</small>
                                <ButtonGroup>
                                    <ToggleButton id="toggle-own" type="radio" checked={editMode === "own"} onChange={() => setEditMode("own")}
                                        variant={ editMode === "own" ? "outline-primary" : "outline-secondary" }
                                    >
                                        Own Only
                                    </ToggleButton>
                                    <ToggleButton id="toggle-all" type="radio" checked={editMode === "all"} onChange={() => setEditMode("all")}
                                      variant={ editMode === "all" ? "outline-primary" : "outline-secondary" }
                                    >
                                        All Players
                                    </ToggleButton>
                                </ButtonGroup>
                            </div>
                        </div>

                        {/* PLAYERS OVERVIEW */}
                        <div className="d-flex justify-content-center flex-wrap gap-3 mb-4">
                            {players
                                .filter((p) => p)
                                .map((p, idx) => (
                                    <div key={idx} className="p-3 border rounded bg-white shadow-sm d-flex align-items-center" style={{ width: 230 }} >
                                        <img src={p.image} alt={p.name}
                                            style={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                marginRight: "1rem",
                                            }}
                                        />
                                        <div className="text-start">
                                            <h6 className="fw-bold mb-0">{p.name}</h6>
                                            <small className="text-muted">
                                                HC: {p.handicap} | Tee: {p.tee}
                                            </small>
                                        </div>
                                    </div>
                              ))
                            }
                        </div>

                        {/* SINGLE LIVE SCORE TABLE */}
                        <div className="table-responsive">
                            <table className="table table-bordered align-middle text-center bg-white shadow-sm">
                                <thead className="table-success">
                                    <tr>
                                        <th>Hole</th>
                                        {players.filter((p) => p).map((p, idx) => (<th key={idx}>{p.name}</th> ))}
                                        <th>Hole Par / Features</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: holeCount }).map((_, holeIdx) => (
                                        <tr key={holeIdx}>
                                            <td>Hole {holeIdx + 1}</td>

                                            {/* each player column (editable per permission) */}
                                            {players.map((p, playerIdx) => {
                                                if (!p) return <td key={playerIdx}>—</td>;

                                                const viewerIsThisPlayer = playerIdx === viewerSlotIndex;
                                                const canEdit = editMode === "all" || viewerIsThisPlayer;

                                                return (
                                                    <td key={playerIdx}>
                                                        <input type="number" min="0"
                                                            value={ scores[playerIdx] ? scores[playerIdx][holeIdx] : "" }
                                                            onChange={(e) =>
                                                                handleScoreChange(
                                                                    playerIdx,
                                                                    holeIdx,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="form-control text-center"
                                                            style={{ maxWidth: 90, margin: "0 auto" }}
                                                            disabled={!canEdit}
                                                        />
                                                    </td>
                                                );
                                            })}

                                            {/* hole features column (optional display) */}
                                            <td style={{ textAlign: "left" }}>
                                                {features[holeIdx + 1] ? ( features[holeIdx + 1].join(", ") ) : ( <small className="text-muted">—</small>)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                                {/* totals row */}
                                <tfoot>
                                    <tr>
                                        <th>Total</th>
                                        {players.map((p, playerIdx) => {
                                            if (!p) return <th key={playerIdx}>—</th>;
                                            const total = (scores[playerIdx] || []).reduce((s, v) => s + (parseInt(v) || 0),0);
                                            return <th key={playerIdx}>{total}</th>;
                                        })}
                                        <th />
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* ACTIONS */}
                        <div className="text-center mt-4">
                            <Button variant="secondary" onClick={() => setStep(4)} className="me-2" >
                                Back
                            </Button>
                            <Button variant="warning" onClick={resetScores} className="me-2">
                                Reset
                            </Button>
                            <Button variant="primary" onClick={saveScores}>
                                Save Scores
                            </Button>
                        </div>
                    </div>
                )}
            </Container>
        </>
    );
};

export default GameMode;
