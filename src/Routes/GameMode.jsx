import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Container,
  Modal,
  ToggleButton,
  ButtonGroup,
} from "react-bootstrap";
import { GameModeCard } from "../Styles/HomeStyle";
// import IMAGES from "../assets/images";
import HeroComp from "../Components/HeroComp";
import IMAGES from "../assets/images";

const GameMode = () => {
  const [step, setStep] = useState(1);

  // ---------- Replace this with your real logged-in user ----------
  const currentUser = {
    name: "Obarinsola Olatunji",
    image: IMAGES.player1,
    handicap: "+2",
    tee: "60",
  };
  // ----------------------------------------------------------------

  // Global states for selections
  const [gameMode, setGameMode] = useState("");
  const [course, setCourse] = useState("");
  const [holeType, setHoleType] = useState("18");
  const [gameFormat, setGameFormat] = useState("Stroke Play");
  const [features, setFeatures] = useState({});

  // players: slot contains either null or a player object {name,image,handicap,tee}
  const [players, setPlayers] = useState([currentUser, null, null, null]); // 4 slots
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // live scores state: array of arrays: scores[playerIndex][holeIdx] = string/number
  const holeCount = holeType === "18" ? 18 : 9;
  const [scores, setScores] = useState(() =>
    players.map(() => Array(holeCount).fill(""))
  );

  // editMode: 'own' (default) or 'all' (host/scorekeeper)
  const [editMode, setEditMode] = useState("own");

  // Example data
  const gameModes = [
    {
      name: "Member Game",
      desc: "Perfect for casual play or practice. Invite friends or join a friendly round at registered golf courses near you.",
      image: IMAGES.image3,
    },
    {
      name: "Tournament Game",
      desc: "Compete in structured competitions and climb the leaderboard.",
      image: IMAGES.image5,
    },
    {
      name: "Versus Game",
      desc: "Perfect for casual play or practice. Invite friends or join a friendly round at registered golf courses near you.",
      image: IMAGES.image2,
    },
  ];

  const courses = [
    "Ijebu Golf Club",
    "Lagos Golf Course",
    "Ibadan View Course",
  ];

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

  // Keep scores array in sync if holeCount or players change
  useEffect(() => {
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
  }, [holeType, players]);

  // helpers
  const openPlayerModal = (slot) => {
    setSelectedSlot(slot);
    setShowModal(true);
  };

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

  const saveScores = () => {
    // implement persist to backend here
    console.log("Saved scores:", scores);
    alert("Scores saved (console logged).");
  };

  const resetScores = () => {
    setScores(players.map(() => Array(holeCount).fill("")));
  };

  // helper: find current user's slot index in players (by name)
  const viewerSlotIndex = players.findIndex(
    (p) => p && p.name === currentUser.name
  );

  // score table players to display (only those selected)
  const activePlayers = players
    .map((p, idx) => ({ p, idx }))
    .filter((x) => x.p);

  // ---------- UI ----------------
  return (
    <>
      <HeroComp $heroImage={IMAGES.image4}>
        <h2 className="text-center mb-4 display-5 fw-bold">Our Game Modes</h2>
      </HeroComp>

      <Container className="mt-5" id="section_3">
        {/* small progress bar (optional: insert above content) */}
        <div className="mb-4">
          <h5 className="fw-bold">Setup Progress</h5>
          <div
            className="progress"
            style={{ height: "20px", borderRadius: "10px" }}
          >
            <div
              className={`progress-bar ${
                step === 5 ? "bg-success" : "bg-info"
              } progress-bar-striped progress-bar-animated`}
              role="progressbar"
              style={{
                width: `${(step / 5) * 100}%`,
                transition: "width 0.5s ease",
              }}
            >
              {Math.round((step / 5) * 100)}%
            </div>
          </div>
        </div>

        {/* ---------- Steps 1-4 unchanged (I left them as you had them) ---------- */}
        {step === 1 && (
          <div className="text-center">
            <h2 className="mb-4">Choose Game Mode</h2>
            <Row>
              {gameModes.map((mode, index) => (
                <Col
                  key={index}
                  md={4}
                  className="mb-4"
                  onClick={() => {
                    setGameMode(mode.name);
                    setStep(2); // move immediately to next step
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <GameModeCard
                    bg={mode.image}
                    className={
                      gameMode === mode.name
                        ? "border border-danger border-2"
                        : ""
                    }
                  >
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
          <div className="p-5 border rounded-4 bg-light shadow">
            <div className="text-center">
              <h2 className="mb-4">
                Select Course & Hole Type{" "}
                {gameMode && (
                  <span className="badge text-bg-info">
                    <small>{gameMode}</small>
                  </span>
                )}
              </h2>
              <Form className="mb-3">
                <Form.Group className="mb-3">
                  <Form.Label>Choose Course</Form.Label>
                  <Form.Select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                  >
                    <option value="">Select Course</option>
                    {courses.map((location, idx) => (
                      <option key={idx} value={location}>
                        {location}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Choose Hole Type</Form.Label>
                  <Form.Select
                    value={holeType}
                    onChange={(e) => setHoleType(e.target.value)}
                  >
                    <option value="18">Full 18 Holes</option>
                    <option value="9-front">Front 9</option>
                    <option value="9-back">Back 9</option>
                  </Form.Select>
                </Form.Group>
              </Form>
              <Button
                variant="secondary"
                onClick={() => setStep(1)}
                className="me-2"
              >
                Back
              </Button>
              <Button disabled={!course} onClick={() => setStep(3)}>
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-5 border rounded-4 bg-light shadow">
            <div>
              <h2 className="mb-4 text-center">Game Setup</h2>
              <Form>
                {/* Game Format */}
                <Form.Group className="mb-3">
                  <Form.Label>Game Format</Form.Label>
                  <Form.Select
                    value={gameFormat}
                    onChange={(e) => setGameFormat(e.target.value)}
                  >
                    <option>Stroke Play</option>
                    <option>Stableford</option>
                  </Form.Select>
                </Form.Group>

                {/* Features per Hole */}
                <Form.Group className="mb-3">
                  <Form.Label>Assign Features Per Hole</Form.Label>
                  <div
                    className="border p-3 rounded bg-white"
                    style={{
                      maxHeight: "500px",
                      overflowY: "auto",
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: "1rem",
                    }}
                  >
                    {[...Array(holeCount)].map((_, idx) => {
                      const holeNumber = idx + 1;
                      return (
                        <div
                          key={idx}
                          className="p-3 border rounded bg-light"
                          style={{ minWidth: "200px" }}
                        >
                          <h6 className="fw-bold text-center">
                            Hole {holeNumber}
                          </h6>
                          {specialFeatures.map((f, i) => {
                            const checkboxId = `hole-${holeNumber}-feat-${i}`;
                            return (
                              <Form.Check
                                key={i}
                                id={checkboxId}
                                type="checkbox"
                                label={f}
                                checked={(features[holeNumber] || []).includes(
                                  f
                                )}
                                onChange={() => {
                                  setFeatures((prev) => {
                                    const updated = { ...(prev || {}) };
                                    const holeArr = updated[holeNumber]
                                      ? [...updated[holeNumber]]
                                      : [];
                                    if (holeArr.includes(f)) {
                                      updated[holeNumber] = holeArr.filter(
                                        (x) => x !== f
                                      );
                                    } else {
                                      updated[holeNumber] = [...holeArr, f];
                                    }
                                    return updated;
                                  });
                                }}
                              />
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </Form.Group>
              </Form>

              <div className="text-center">
                <Button
                  variant="secondary"
                  onClick={() => setStep(2)}
                  className="me-2"
                >
                  Back
                </Button>
                <Button onClick={() => setStep(4)}>Next</Button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="p-5 border rounded-4 bg-light shadow">
            <div className="text-center">
              <h2 className="mb-4">Add Players</h2>

              {/* PLAYER GRID */}
              <div className="mb-4">
                <h5 className="text-start fw-bold mb-3">Group 1</h5>

                <div
                  className="player-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {players.map((player, idx) => (
                    <div
                      key={idx}
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
              <div className="mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setStep(3)}
                  className="me-2"
                >
                  Back
                </Button>
                <Button variant="success" onClick={() => setStep(5)}>
                  Start Game
                </Button>
              </div>
            </div>

            {/* PLAYER SELECTION MODAL */}
            <Modal
              show={showModal}
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
                    const alreadyPicked = players.some(
                      (p) => p && p.name === rp.name
                    );
                    return (
                      <div
                        key={i}
                        className={`p-3 border rounded d-flex align-items-center shadow-sm ${
                          alreadyPicked
                            ? "bg-dark-subtle text-muted"
                            : "hover-bg-light"
                        }`}
                        style={{
                          cursor: alreadyPicked ? "not-allowed" : "pointer",
                        }}
                        onClick={() => {
                          if (selectedSlot === null || alreadyPicked) return;
                          selectPlayerForSlot(selectedSlot, rp);
                          setShowModal(false);
                          setSelectedSlot(null);
                        }}
                      >
                        <img
                          src={rp.image}
                          alt={rp.name}
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
                          <span
                            className="badge bg-success"
                            style={{ fontSize: 12 }}
                          >
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
                  <ToggleButton
                    id="toggle-own"
                    type="radio"
                    variant={
                      editMode === "own"
                        ? "outline-primary"
                        : "outline-secondary"
                    }
                    checked={editMode === "own"}
                    onChange={() => setEditMode("own")}
                  >
                    Own Only
                  </ToggleButton>
                  <ToggleButton
                    id="toggle-all"
                    type="radio"
                    variant={
                      editMode === "all"
                        ? "outline-primary"
                        : "outline-secondary"
                    }
                    checked={editMode === "all"}
                    onChange={() => setEditMode("all")}
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
                  <div
                    key={idx}
                    className="p-3 border rounded bg-white shadow-sm d-flex align-items-center"
                    style={{ width: 230 }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
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
                ))}
            </div>

            {/* SINGLE LIVE SCORE TABLE */}
            <div className="table-responsive">
              <table className="table table-bordered align-middle text-center bg-white shadow-sm">
                <thead className="table-success">
                  <tr>
                    <th>Hole</th>
                    {players
                      .filter((p) => p)
                      .map((p, idx) => (
                        <th key={idx}>{p.name}</th>
                      ))}
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

                        const viewerIsThisPlayer =
                          playerIdx === viewerSlotIndex;
                        const canEdit =
                          editMode === "all" || viewerIsThisPlayer;

                        return (
                          <td key={playerIdx}>
                            <input
                              type="number"
                              min="0"
                              value={
                                scores[playerIdx]
                                  ? scores[playerIdx][holeIdx]
                                  : ""
                              }
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
                        {features[holeIdx + 1] ? (
                          features[holeIdx + 1].join(", ")
                        ) : (
                          <small className="text-muted">—</small>
                        )}
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
                      const total = (scores[playerIdx] || []).reduce(
                        (s, v) => s + (parseInt(v) || 0),
                        0
                      );
                      return <th key={playerIdx}>{total}</th>;
                    })}
                    <th />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* ACTIONS */}
            <div className="text-center mt-4">
              <Button
                variant="secondary"
                onClick={() => setStep(4)}
                className="me-2"
              >
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
