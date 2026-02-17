import { useEffect, useRef, useState } from "react";
import {
    Button,
    Row,
    Col,
    Container,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { GoArrowUpRight } from "react-icons/go";
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
import { useOngoingRound } from "../app-context/ongoing-game-context";

const GameMode = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { setCourses, setLoading } = useActiveCourses();
    const { limitGameCourseSearch, gameCourseSearch } = useCourseController();
    const { createGame } = useGameController();
    const { authUser } = useAuthUser();    
    const { setOngoingGame } = useOngoingRound();
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
    const [rounds, setRounds] = useState(1); // rounds to send to backend

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
            // clear the newly created ongoing game in context
            setOngoingGame(null);
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

	const submitCourse = (data) => {
        setCourse(data);
        setOngoingGame(data);
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
    
    const setNewRounds = (round) => {
        setRounds(round);
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
                mode: gameMode.id,
                rounds
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

    const gotoGame = () => {
        const nameArr = ongoingRound.name.split(' ');
        const strName = nameArr.join('+');
        navigate(`/dashboard/client/${ongoingRound.id}/game/${strName}`);
    };

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
                        setUpGame={setUpGame} 
                        handleCancel={() => {
                            setStep(2);
                            setHeroText('Golf Course Selection & Holes');
                        }} 
                        networkRequest={networkRequest}
                        btnRedText={'Back'}
                        setHolesContests={setHolesContests}
                        setRounds={setNewRounds} />}

                {step === 4 && <PlayerSelection gameGroupArr={gameGroupArr} game={ongoingRound} />}
                {step === 4 && 
                    <div className='row mb-5'>
                        <div className="col-12 d-flex align-items-center justify-content-center">
                            <Button variant="success" className="fw-bold col-12 col-md-4" onClick={gotoGame} >
                                <GoArrowUpRight size='32px' /> Go to game
                            </Button>
                        </div>
                    </div>
                }
            </Container>
        </>
    );
};

export default GameMode;
