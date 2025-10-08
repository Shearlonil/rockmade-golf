import React, { useState } from "react";
import { Card, Button, Row, Col, Form } from "react-bootstrap";

const GameSetupWizard = () => {
  const [step, setStep] = useState(1);

  // Global states for selections
  const [gameMode, setGameMode] = useState("");
  const [course, setCourse] = useState("");
  const [holeType, setHoleType] = useState("18");
  const [gameFormat, setGameFormat] = useState("Stroke Play");
  const [features, setFeatures] = useState([]);
  const [players, setPlayers] = useState(["You", "", "", ""]); // 4 slots

  // Available data
  const gameModes = [
    { name: "Member Game", desc: "Casual play with friends." },
    { name: "Tournament Game", desc: "Competitive tournament setup." },
    { name: "Versus Game", desc: "1v1 head-to-head challenge." },
  ];

  const courses = [
    "Royal Golf Club",
    "Lakeside Golf Course",
    "Mountain View Course",
  ];
  const specialFeatures = [
    "Port-Not-Port",
    "Beddy No Beddy",
    "Mulligan",
    "Longest Drive",
    "Closest to Pin",
  ];
  const registeredPlayers = [
    "Jane Smith",
    "Mike Johnson",
    "Sarah Lee",
    "Chris Brown",
    "David Kim",
    "Emma Wilson",
  ];

  // Handle checkbox toggle
  const toggleFeature = (feature) => {
    setFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  return (
    <div className="container mt-5">
      {/* Step 1 – Game Mode */}
      {step === 1 && (
        <div className="text-center">
          <h2 className="mb-4">Choose Game Mode</h2>
          <Row>
            {gameModes.map((mode, idx) => (
              <Col md={4} key={idx}>
                <Card
                  className={`shadow-lg mb-4 ${
                    gameMode === mode.name ? "border-primary" : ""
                  }`}
                  onClick={() => setGameMode(mode.name)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body>
                    <Card.Title>{mode.name}</Card.Title>
                    <Card.Text>{mode.desc}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Button disabled={!gameMode} onClick={() => setStep(2)}>
            Next
          </Button>
        </div>
      )}

      {/* Step 2 – Course & Hole Type */}
      {step === 2 && (
        <div className="text-center">
          <h2 className="mb-4">Select Course & Hole Type</h2>
          <Form className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Choose Course</Form.Label>
              <Form.Select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              >
                <option value="">-- Select Course --</option>
                {courses.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
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
      )}

      {/* Step 3 – Game Setup */}
      {step === 3 && (
        <div>
          <h2 className="mb-4 text-center">Game Setup</h2>
          <Form>
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
              <Form.Label>Special Features</Form.Label>
              {specialFeatures.map((f, idx) => (
                <Form.Check
                  key={idx}
                  type="checkbox"
                  label={f}
                  checked={features.includes(f)}
                  onChange={() => toggleFeature(f)}
                />
              ))}
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
      )}

      {/* Step 4 – Add Players */}
      {step === 4 && (
        <div className="text-center">
          <h2 className="mb-4">Add Players</h2>
          <Form>
            {players.map((player, idx) => (
              <Form.Group className="mb-3" key={idx}>
                <Form.Label>Player {idx + 1}</Form.Label>
                {idx === 0 ? (
                  <Form.Control type="text" value={player} disabled />
                ) : (
                  <Form.Select
                    value={player}
                    onChange={(e) => {
                      const newPlayers = [...players];
                      newPlayers[idx] = e.target.value;
                      setPlayers(newPlayers);
                    }}
                  >
                    <option value="">-- Select Player --</option>
                    {registeredPlayers.map((rp, i) => (
                      <option key={i} value={rp}>
                        {rp}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
            ))}
          </Form>
          <Button
            variant="secondary"
            onClick={() => setStep(3)}
            className="me-2"
          >
            Back
          </Button>
          <Button variant="success" onClick={() => alert("Game Started!")}>
            Start Game
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameSetupWizard;
