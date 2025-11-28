import { useEffect, useRef, useState } from "react";
import {
    Button,
    Row,
    Col,
    Form,
    Container,
    Modal,
    ToggleButton,
    ButtonGroup,
} from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Select from "react-select";
import Datetime from 'react-datetime';
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation } from "react-router-dom";
import { format, isAfter, subDays } from 'date-fns';

import { GameModeCard } from "../Styles/HomeStyle";
import HeroComp from "../Components/HeroComp";
import IMAGES from "../assets/images";
import crypt from "../Utils/crypto-helper";
import ErrorMessage from "../Components/ErrorMessage";
import { course_selection_schema } from "../Utils/yup-schema-validator/game-creation-schema";
import { gameModes } from "../Utils/data";
import HolesContestsDialog from "../Components/DialogBoxes/HolesContestsDialog";
import handleErrMsg from '../Utils/error-handler';
import { ThreeDotLoading } from "../Components/react-loading-indicators/Indicator";
import { useAuthUser } from "../app-context/user-context";
import useCourseController from "../api-controllers/course-controller-hook";
import useGameController from "../api-controllers/game-controller-hook";

const GameMode = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { fetchAllActive } = useCourseController();
    const { createGame } = useGameController();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [step, setStep] = useState(1);
    
    const [networkRequest, setNetworkRequest] = useState(false);
	const [golfCourseOptions, setGolfCourseOptions] = useState([]);
	const [golfCoursesLoading, setGolfCoursesLoading] = useState(true);
	const [holeOptions, setHoleOptions] = useState([]);
	const [holesLoading, setHolesLoading] = useState(true);
	const [holesContestData, setHolesContestData] = useState([]);
    
    // Global states for selections
    const [gameMode, setGameMode] = useState("");
    const [course, setCourse] = useState({});
    const [holeType, setHoleType] = useState("18");
    const [gameFormat, setGameFormat] = useState("Stroke Play");
    const [features, setFeatures] = useState({});
	const [showHolesContestsModal, setShowHolesContestsModal] = useState("");

    // players: slot contains either null or a player object {name,image,handicap,tee}
    const [players, setPlayers] = useState([user, null, null, null]); // 4 slots
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // live scores state: array of arrays: scores[playerIndex][holeIdx] = string/number
    const holeCount = holeType === "18" ? 18 : 9;
    const [scores, setScores] = useState(() => players.map(() => Array(holeCount).fill("")) );

    // editMode: 'own' (default) or 'all' (host/scorekeeper)
    const [editMode, setEditMode] = useState("own");

    const yesterday = subDays(new Date(), 1); // Subtracts 1 day from today to use as past dates
    const disablePastDt = current => current.isAfter(yesterday);

	const {
		register,
		handleSubmit: handleGolfCourseSelectionSubmit,
		control: courseSelectionControl,
		reset: courseSelectionReset,
		setValue,
		formState: { errors: golfCourseSelectionErrors },
	} = useForm({
		resolver: yupResolver(course_selection_schema),
		defaultValues: {
			course: null,
            startDate: new Date(),
		},
	});

    const specialFeatures = [
        "Port-Not-Port",
        "Beddy No Beddy",
        "Mulligan",
        "Longest Drive",
        "Closest to Pin",
    ];

    const registeredPlayers = [
        {
            name: "Obarinsola Olatunji",
            image: IMAGES.player1,
            handicap: "+2",
            tee: "60",
        },
        {
            name: "Olumide Olumide",
            image: IMAGES.player2,
            handicap: "0",
            tee: "58",
        },
        { name: "Joshua Josh", image: IMAGES.player3, handicap: "+1", tee: "59" },
        { name: "Charles Bob", image: IMAGES.player4, handicap: "-1", tee: "61" },
        { name: "Henry Danger", image: IMAGES.player5, handicap: "+3", tee: "62" },
        {
            name: "Jesse Lee Peterson",
            image: IMAGES.player6,
            handicap: "+4",
            tee: "57",
        },
    ];

    useEffect(() => {
        if(user && !user.sub){
            // staff now allowed, because user.sub for staff will be undefined
            toast.info("Only subscribed memebers are allowed to create games")
            // navigate to dashboard
            navigate('/dashboard')
        }
        if(user && user.sub && isAfter(new Date(), new Date(crypt.decryptData(user.sub)).setHours(23, 59, 59, 0))){
            // navigate to sub page
            navigate('/memberships')
        }
        // Cancel any previous in-flight request
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        initialize();
        // ensure scores has correct holeCount and player slots
        setScores((prev) => {
            const newScores = players.map((_, pIdx) => {
                const existing = prev[pIdx] || [];
                // trim or extend existing to holeCount
                const copy = existing.slice(0, holeCount);
                while (copy.length < holeCount) copy.push("");
                return copy;
            });
            return newScores;
        });

        return () => {
            // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
            controllerRef.current.abort();
        };
    }, [holeType, players, location.pathname]);

    const initialize = async () => {
        try {
            controllerRef.current = new AbortController();
            setNetworkRequest(true);
            const response = await fetchAllActive(controllerRef.current.signal);
            setGolfCourseOptions(response.data.map(course => ({label: course.name, value: course})));
            setGolfCoursesLoading(false);

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

    const handleCloseModal = () => setShowHolesContestsModal(false);

    const selectPlayerForSlot = (slotIdx, playerObj) => {
        setPlayers((prev) => {
            const copy = [...prev];
            copy[slotIdx] = playerObj;
            return copy;
        });
    };

    const unselectPlayer = (slotIdx) => {
        setPlayers((prev) => {
            const copy = [...prev];
            copy[slotIdx] = null;
            return copy;
        });
    };

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

    //  Handle golf course selection change
    const handleGolfCourseChange = (selectedCourse) => {
        const arr = [];
        if(selectedCourse.value.no_of_holes === 18){
            let full = {label: 'Full 18', value: 1};
            let front = {label: 'Front 9', value: 2};
            let back = {label: 'Back 9', value: 3};
            arr.splice(0, 0, full, front, back);
        }else {
            arr.push({label: 'Front 9', value: 2});
        }
        setHoleOptions(arr);
        setHolesLoading(false);
        setValue("hole_mode", null);
    };

	const submitCourse = (data) => {
        setCourse(data);
        setStep(3);
        const arr = [];
        data.course?.value?.Holes?.forEach(hole => {
            hole.contest.forEach(contest => {
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
        });
        setHolesContestData(arr);
    };

    const updateHolesContest = (data) => {
        const arr = [];
        data.filter(datum => datum.selectedHoles.length > 0).forEach(datum => arr.push({id: datum.id, name: datum.name, holes: datum.selectedHoles}));
        const c = {...course};
        c.contests = arr;
        setCourse(c);
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
            await createGame(controllerRef.current.signal, data);
            setStep(4);
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

    const saveScores = () => {
        // implement persist to backend here
        alert("Scores saved (console logged).");
    };

    const resetScores = () => {
        setScores(players.map(() => Array(holeCount).fill("")));
    };

    // helper: find current user's slot index in players (by name)
    const viewerSlotIndex = players.findIndex((p) => p && p.name === user.name);

    // score table players to display (only those selected)
    const activePlayers = players
        .map((p, idx) => ({ p, idx }))
        .filter((x) => x.p);

    return (
        <>
            <HeroComp $heroImage={IMAGES.image4}>
                <h2 className="text-center mb-4 display-5 fw-bold">Our Game Modes</h2>
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

                {step === 2 && (
                    <div className="d-flex flex-column justify-content-center align-items-center text-center p-md-5 p-3 border rounded-4 bg-light shadow mb-5">
                        <h2 className="mb-4">
                            Select Course & Hole Type{" "}
                            {gameMode && (
                                <span className="badge text-bg-info">
                                    <small>{gameMode.name}</small>
                                </span>
                            )}
                        </h2>
                        <Form className="mb-4 row d-flex justify-content-center">
                            <div className="d-flex row">
                                <Form.Group className="col-12 col-md-6 mb-3">
                                    <Form.Label className="fw-bold">Game Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Game Name"
                                        {...register("name")}
                                    />
                                    <ErrorMessage source={golfCourseSelectionErrors.name} />
                                </Form.Group>

                                <Form.Group className="col-12 col-md-6 mb-3">
                                    <Form.Label className="fw-bold">Game Date</Form.Label>
                                    <Controller
                                        name="startDate"
                                        control={courseSelectionControl}
                                        render={({ field }) => (
                                            <Datetime
                                                {...field}
                                                timeFormat={false}
                                                closeOnSelect={true}
                                                dateFormat="DD/MM/YYYY"
                                                isValidDate={disablePastDt}
                                                inputProps={{
                                                    placeholder: "Choose date",
                                                    className: "form-control",
                                                    readOnly: true, // Optional: makes input read-only
                                                }}
                                                value={field.value ? new Date(field.value) :  null}
                                                onChange={(date) => field.onChange(date ? date.toDate() : null) }
                                                /*	react-hook-form is unable to reset the value in the Datetime component because of the below bug.
                                                    refs:
                                                        *	https://stackoverflow.com/questions/46053202/how-to-clear-the-value-entered-in-react-datetime
                                                        *	https://stackoverflow.com/questions/69536272/reactjs-clear-date-input-after-clicking-clear-button
                                                    there's clearly a rendering bug in component if you try to pass a null or empty value in controlled component mode: 
                                                    the internal input still got the former value entered with the calendar (uncontrolled ?) despite the fact that that.state.value
                                                    or field.value is null : I've been able to "patch" it with the renderInput prop :*/
                                                renderInput={(props) => {
                                                    return <input {...props} value={field.value ? props.value : ''} />
                                                }}
                                            />
                                        )}
                                    />
                                    <ErrorMessage source={golfCourseSelectionErrors.startDate} />
                                </Form.Group>
                            </div>

                            <div className="d-flex row">
                                <Form.Group className="col-12 col-md-6 mb-3">
                                    <Form.Label className="fw-bold">Choose Course</Form.Label>
                                    <Controller
                                        name="course"
                                        control={courseSelectionControl}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                required
                                                name="course"
                                                placeholder="Select Golf Course..."
                                                className="text-dark"
                                                isLoading={golfCoursesLoading}
                                                options={golfCourseOptions}
                                                value={value}
                                                onChange={(val) => {
                                                    onChange(val);
                                                    handleGolfCourseChange(val);
                                                }}
                                            />
                                        )}
                                    />
                                    <ErrorMessage source={golfCourseSelectionErrors.course} />
                                </Form.Group>
                                <Form.Group className="col-12 col-md-6 mb-3">
                                    <Form.Label className="fw-bold">How many holes are you playing?</Form.Label>
                                    <Controller
                                        name="hole_mode"
                                        control={courseSelectionControl}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                required
                                                name="hole_mode"
                                                placeholder="Number of holes..."
                                                className="text-dark"
                                                isLoading={holesLoading}
                                                options={holeOptions}
                                                value={value}
                                                onChange={(val) => { onChange(val) }}
                                            />
                                        )}
                                    />
                                    <ErrorMessage source={golfCourseSelectionErrors.hole_mode} />
                                </Form.Group>
                            </div>
                        </Form>
                        <div className="d-flex flex-row row justify-content-center container gap-3 flex-md-row-reverse mb-2">
                            <Button onClick={handleGolfCourseSelectionSubmit(submitCourse)} className="me-2 btn-primary col-md-4 col-sm-12">
                                Next
                            </Button>
                            <Button variant="secondary" onClick={() => setStep(1)} className="me-2 btn-danger col-md-4 col-sm-12" >
                                Back
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="p-5 border rounded-4 bg-light shadow mb-5">
                        <h2 className="mb-4 text-center">{gameMode.name} Setup</h2>

                        <div className="row">
                            <div className="col-12 col-md-6 d-flex flex-column mt-3">
                                <Form.Label className="fw-bold">Golf Course</Form.Label>
                                <Form.Label className="text-primary fw-bold h3">{course.course.label}</Form.Label>
                            </div>
                            <div className="col-12 col-md-6 d-flex flex-column mt-3">
                                <Form.Label className="fw-bold">Game Name</Form.Label>
                                <Form.Label className="text-primary fw-bold h3">{course.name}</Form.Label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 col-md-6 d-flex flex-column mt-3">
                                <Form.Label className="fw-bold">Game Date</Form.Label>
                                <Form.Label className="text-primary fw-bold h3">{format(course.startDate, "yyyy-MM-dd")}</Form.Label>
                            </div>
                            <div className="col-12 col-md-6 d-flex flex-column mt-3">
                                <div className="d-flex gap-5">
                                    <div className="d-flex flex-column">
                                        <Form.Label className="fw-bold">Holes</Form.Label>
                                        <Form.Label className="text-primary fw-bold h3">{course.hole_mode.label}</Form.Label>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <Form.Label className="fw-bold">Contests</Form.Label>
                                        <Button className="btn-success fw-bold" onClick={() => setShowHolesContestsModal(true)}>Add Contests</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-row row justify-content-center container gap-3 flex-md-row-reverse mt-4">
                            <Button onClick={ setUpGame } className="me-2 btn-primary col-md-4 col-sm-12" disabled={networkRequest}>
                                {!networkRequest && 'Next'}
                                {networkRequest && <ThreeDotLoading color="#ffffff" size="small" />}
                            </Button>
                            <Button variant="secondary" onClick={() => setStep(2)} className="me-2 btn-danger col-md-4 col-sm-12" disabled={networkRequest} >
                                {!networkRequest && 'Back'}
                                {networkRequest && <ThreeDotLoading color="#ffffff" size="small" />}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="p-5 border rounded-4 bg-light shadow mb-5">
                        <div className="text-center">
                            <h2 className="mb-4">Add Players</h2>

                            {/* PLAYER GRID */}
                            <div className="mb-4">
                                <h5 className="text-start fw-bold mb-3">Group 1</h5>

                                <div className="player-grid"
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                                        gap: "1rem",
                                    }}
                                >
                                    {players.map((player, idx) => (
                                        <div key={idx}
                                            className="position-relative p-3 border rounded bg-white d-flex flex-column align-items-center justify-content-center shadow-sm"
                                            style={{
                                                minHeight: "150px",
                                                cursor: idx === 0 ? "default" : "pointer",
                                            }}
                                            onClick={() => {
                                              if (idx !== 0) {
                                                  setSelectedSlot(idx);
                                                  setShowModal(true);
                                              }
                                            }}
                                        >
                                            {/* Unselect button (except maybe prevent unselecting host without confirmation) */}
                                            {player && idx !== 0 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        unselectPlayer(idx);
                                                    }}
                                                    className="btn btn-sm btn-outline-danger position-absolute"
                                                    style={{ top: 8, right: 8 }}
                                                >
                                                    Remove
                                                </button>
                                            )}

                                            {player ? (
                                                <>
                                                    <img
                                                        src={player.image}
                                                        alt={player.name}
                                                        style={{
                                                            width: "60px",
                                                            height: "60px",
                                                            borderRadius: "50%",
                                                            objectFit: "cover",
                                                            marginBottom: "0.5rem",
                                                        }}
                                                    />
                                                    <h6 className="fw-bold">{player.name}</h6>
                                                    <small className="text-muted">
                                                        HC: {player.handicap} | Tee: {player.tee}
                                                    </small>
                                                </>
                                            ) : (
                                                <div className="text-center text-muted">
                                                    <div
                                                        style={{
                                                            width: "50px",
                                                            height: "50px",
                                                            borderRadius: "50%",
                                                            background: "#e9ecef",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: "24px",
                                                            margin: "0 auto 0.5rem",
                                                        }}
                                                    >
                                                        +
                                                    </div>
                                                    <span>Add Player</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* NAVIGATION */}
                            <div className="d-flex flex-row row justify-content-center container gap-3 flex-md-row-reverse">
                                <Button onClick={ () => setStep(5)} className="me-2 btn-success col-md-4 col-sm-12">
                                    Start Game
                                </Button>
                                <Button variant="secondary" onClick={() => setStep(3)} className="me-2 btn-danger col-md-4 col-sm-12" >
                                    Back
                                </Button>
                            </div>
                        </div>

                        {/* PLAYER SELECTION MODAL */}
                        <Modal show={showModal}
                            onHide={() => {
                                setShowModal(false);
                                setSelectedSlot(null);
                            }}
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Select a Player</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="d-flex flex-column gap-2">
                                    {registeredPlayers.map((rp, i) => {
                                        const alreadyPicked = players.some((p) => p && p.name === rp.name);
                                        return (
                                            <div key={i}
                                                className={`p-3 border rounded d-flex align-items-center shadow-sm ${alreadyPicked? "bg-dark-subtle text-muted" : "hover-bg-light"}`}
                                                style={{ cursor: alreadyPicked ? "not-allowed" : "pointer",}}
                                                onClick={() => {
                                                    if (selectedSlot === null || alreadyPicked) return;
                                                    selectPlayerForSlot(selectedSlot, rp);
                                                    setShowModal(false);
                                                    setSelectedSlot(null);
                                                }}
                                            >
                                                <img src={rp.image} alt={rp.name}
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                        borderRadius: "50%",
                                                        objectFit: "cover",
                                                        marginRight: "1rem",
                                                        opacity: alreadyPicked ? 0.5 : 1,
                                                    }}
                                                />
                                                <div className="flex-grow-1">
                                                    <h6 className="fw-bold mb-0">{rp.name}</h6>
                                                    <small className="text-muted">
                                                        HC: {rp.handicap} | Tee: {rp.tee}
                                                    </small>
                                                </div>
                                                {alreadyPicked && (
                                                    <span className="badge bg-success" style={{ fontSize: 12 }}>
                                                      ✓ Selected
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>
                )}

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
            <HolesContestsDialog
                show={showHolesContestsModal}
                handleClose={handleCloseModal}
                data={holesContestData}
                course={course}
                updateHolesContest={updateHolesContest}
            />
        </>
    );
};

export default GameMode;
