import { useState } from "react";
import { Table, Form, Button } from "react-bootstrap";

const ScoreTable = () => {
  const [holes, setHoles] = useState(9);
  const players = ["Player 1", "Player 2", "Player 3", "Player 4"];

  // Editable scores (temporary, before pressing update)
  const [tempScores, setTempScores] = useState(
    players.map(() => Array(holes).fill(""))
  );

  // Saved scores (committed after pressing update)
  const [savedScores, setSavedScores] = useState(
    players.map(() => Array(holes).fill(""))
  );

  // Change course type
  const handleHolesChange = (e) => {
    const newHoles = parseInt(e.target.value);
    setHoles(newHoles);
    setTempScores(players.map(() => Array(newHoles).fill("")));
    setSavedScores(players.map(() => Array(newHoles).fill("")));
  };

  // Track temp input
  const handleTempChange = (pIdx, hIdx, value) => {
    const newTemp = [...tempScores];
    newTemp[pIdx][hIdx] = value;
    setTempScores(newTemp);
  };

  // Commit changes to saved table
  const handleUpdate = () => {
    setSavedScores(tempScores.map((row) => [...row])); // deep copy
  };

  // Reset input table
  const handleReset = () => {
    setTempScores(players.map(() => Array(holes).fill("")));
  };

  // Calculate total
  const getTotal = (scores, pIdx) =>
    scores[pIdx].reduce((sum, val) => sum + (parseInt(val) || 0), 0);

  return (
    <div className="mt-4">
      {/* Hole selector */}
      <div className="mb-3 text-center">
        <label className="fw-bold me-2">Select Course:</label>
        <Form.Select
          value={holes}
          onChange={handleHolesChange}
          style={{ width: "200px", display: "inline-block" }}
        >
          <option value={9}>9 Holes</option>
          <option value={18}>18 Holes</option>
        </Form.Select>
      </div>

      {/* Input Table */}
      <div className="table-responsive mb-3">
        <h5 className="text-center">Enter Scores</h5>
        <Table
          bordered
          hover
          className="text-center align-middle border-secondary"
        >
          <thead className="table-primary">
            <tr>
              <th>Player</th>
              {[...Array(holes)].map((_, idx) => (
                <th key={idx} className="text-nowrap px-3">
                  Hole {idx + 1}
                </th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, pIdx) => (
              <tr key={pIdx}>
                <td className="fw-bold">{player}</td>
                {tempScores[pIdx].map((score, hIdx) => (
                  <td key={hIdx}>
                    <Form.Control
                      type="number"
                      min="0" // prevents negatives
                      value={score}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleTempChange(
                          pIdx,
                          hIdx,
                          val === "" ? "" : Math.max(0, parseInt(val))
                        );
                      }}
                      className="text-center"
                      style={{ width: "60px", margin: "auto" }}
                      maxLength={2}
                    />
                  </td>
                ))}
                <td className="fw-bold">{getTotal(tempScores, pIdx)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Action Buttons */}
      <div className="text-center mb-4">
        <Button variant="success" className="me-2" onClick={handleUpdate}>
          Update Scoreboard
        </Button>
        <Button variant="danger" onClick={handleReset}>
          Reset Table
        </Button>
      </div>

      {/* Saved Scores Table */}
      <div className="table-responsive">
        <h5 className="text-center">Scoreboard</h5>
        <Table bordered hover className="text-center align-middle border-dark">
          <thead className="table-dark text-white">
            <tr>
              <th>Player</th>
              {[...Array(holes)].map((_, idx) => (
                <th key={idx}>Hole {idx + 1}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, pIdx) => (
              <tr key={pIdx}>
                <td className="fw-bold">{player}</td>
                {savedScores[pIdx].map((score, hIdx) => (
                  <td key={hIdx}>{score}</td>
                ))}
                <td className="fw-bold">{getTotal(savedScores, pIdx)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ScoreTable;
