import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Table } from 'rsuite';
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
    // player score less hcp
    const [scoreLessHcp, setScoreLessHcp] = useState(0);

    const modalLoaded = () => {
        setP([player]);
        if (player) {
            setScoreLessHcp(player.score - player.hcp);
        }
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
                <Table rowKey="id" data={p} affixHeader affixHorizontalScrollbar autoHeight={true} hover={true} headerHeight={90} >
                    {columns?.map((column, idx) => {
                        const { key, label, ...rest } = column;
                        return (
                            <Column {...rest} key={key} fullText>
                                <HeaderCell>
                                    <CustomHeader title={label} holeProps={holeProps} idx={idx} />
                                </HeaderCell>
                                <Cell dataKey={key} style={{ padding: 6, fontWeight: 'bold', textAlign: 'center', color: 'green' }} />
                            </Column>
                        );
                    })}
                </Table>
                <div className="d-flex justify-content-between m-3 fs-6">
                    <span>
                        Par: <span className='fw-bold'> {totalPar} </span>
                    </span>
                    <span>
                        Score: <span className='fw-bold'> {player?.score}/{scoreLessHcp} </span>
                    </span>
                    <span>
                        Position: <span className='fw-bold'> {player?.position} </span>
                    </span>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default PlayerLeaderboardScoresDialog;