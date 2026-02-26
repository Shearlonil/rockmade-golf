import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Table } from 'rsuite';
import ScoreCard from '../ScoreCard';

const PlayerLeaderboardScoresDialog = ({ player, show, handleClose, columns, holeProps, totalPar }) => {
    const [p, setP] = useState([]);

    const modalLoaded = () => {
        setP([player]);
    }

    return (
        <Modal backdrop='static' centered show={show} onHide={handleClose} onEntered={modalLoaded}>
            <Modal.Header closeButton>
                <span>
                    <Modal.Title> {player?.name} </Modal.Title>
                    <span className="text-success fw-bold">HCP {player?.hcp}</span>
                </span>
            </Modal.Header>
            <Modal.Body>
                <ScoreCard columns={columns} holeProps={holeProps} totalPar={totalPar} player={player} tableData={p} />
            </Modal.Body>
        </Modal>
    )
}

export default PlayerLeaderboardScoresDialog;