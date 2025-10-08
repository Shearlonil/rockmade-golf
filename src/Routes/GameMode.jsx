import React, { useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Container,
  Modal,
} from "react-bootstrap";
import { GameModeCard } from "../Styles/HomeStyle";
import IMAGES from "../assets/images";
import HeroComp from "../Components/HeroComp";

const GameMode = () => {
  const [step, setStep] = useState(1);

  // Global states for selections
  const [gameMode, setGameMode] = useState("");
  const [course, setCourse] = useState("");
  const [holeType, setHoleType] = useState("18");
  const [gameFormat, setGameFormat] = useState("Stroke Play");
  const [features, setFeatures] = useState({});
  const [players, setPlayers] = useState(["You", "", "", ""]); // 4 slots
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

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
    {
      name: "Joshua Josh",
      image: IMAGES.player3,
      handicap: "+1",
      tee: "59",
    },
    {
      name: "Charles Bob",
      image: IMAGES.player4,
      handicap: "-1",
      tee: "61",
    },
    {
      name: "Henry Danger",
      image: IMAGES.player5,
      handicap: "+3",
      tee: "62",
    },
    {
      name: "Jesse Lee Peterson",
      image: IMAGES.player6,
      handicap: "+4",
      tee: "57",
    },
  ];

  return (
    <>
      <HeroComp $heroImage={IMAGES.image4}>
        <h2 className="text-center mb-4 display-5 fw-bold">Our Game Modes</h2>
      </HeroComp>

      <Container className="mt-5" id="section_3">
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
                    {[...Array(holeType === "18" ? 18 : 9)].map((_, idx) => {
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
                          {specialFeatures.map((f, i) => (
                            <Form.Check
                              key={i}
                              type="checkbox"
                              label={f}
                              checked={
                                features[holeNumber]?.includes(f) || false
                              }
                              onChange={() => {
                                setFeatures((prev) => {
                                  const updated = { ...(prev || {}) };
                                  const holeFeatures =
                                    updated[holeNumber] || [];

                                  if (holeFeatures.includes(f)) {
                                    updated[holeNumber] = holeFeatures.filter(
                                      (feat) => feat !== f
                                    );
                                  } else {
                                    updated[holeNumber] = [...holeFeatures, f];
                                  }

                                  return updated;
                                });
                              }}
                            />
                          ))}
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
                      className="p-3 border rounded bg-white d-flex flex-column align-items-center justify-content-center shadow-sm"
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
                <Button
                  variant="success"
                  onClick={() => alert("Game Started!")}
                >
                  Start Game
                </Button>
              </div>
            </div>

            {/* PLAYER SELECTION MODAL */}
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
                  {registeredPlayers.map((thatRegisteredPlayer, index) => {
                    const alreadyPicked = players.some(
                      (p) => p && p.name === thatRegisteredPlayer.name
                    );

                    return (
                      <div
                        key={index}
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
                          const newPlayers = [...players];
                          newPlayers[selectedSlot] = thatRegisteredPlayer;
                          setPlayers(newPlayers);
                          setShowModal(false);
                          setSelectedSlot(null);
                        }}
                      >
                        <img
                          src={thatRegisteredPlayer.image}
                          alt={thatRegisteredPlayer.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginRight: "1rem",
                            opacity: alreadyPicked ? 0.5 : 1,
                          }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-0">
                            {thatRegisteredPlayer.name}
                          </h6>
                          <small className="text-muted">
                            HC: {thatRegisteredPlayer.handicap} | Tee:{" "}
                            {thatRegisteredPlayer.tee}
                          </small>
                        </div>
                        {alreadyPicked && (
                          <span
                            className="badge bg-success"
                            style={{ fontSize: "0.8rem" }}
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
      </Container>
    </>
  );
};

export default GameMode;
