import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Table } from 'rsuite';
import ScoreCard from '../ScoreCard';
const { Column, HeaderCell, Cell } = Table;

const CustomHeader = ({ title, holeProps, idx }) => {
    if(idx === 0){
        return <div className='d-flex flex-column justify-content-center align-items-center text-dark gap-2'>
            <label className='fw-bold text-danger'>{title}</label>
            <label>Handicap</label>
            <label>Par</label>
        </div>
    }
    return <div className='d-flex flex-column justify-content-center align-items-center text-dark gap-2'>
        <label className='fw-bold text-danger'>{title}</label>
        <label>{holeProps[idx]?.hcp_idx}</label>
        <label>{holeProps[idx]?.par}</label>
    </div>
};

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