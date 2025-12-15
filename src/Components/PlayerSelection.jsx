import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';

import { useAuthUser } from '../app-context/user-context';
import IMAGES from '../assets/images';

const PlayerSelection = () => {
    const { authUser } = useAuthUser();
    const user = authUser();

    const [players, setPlayers] = useState([user, null, null, null]); // 4 slots
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
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

    return (
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
    )
}

export default PlayerSelection;