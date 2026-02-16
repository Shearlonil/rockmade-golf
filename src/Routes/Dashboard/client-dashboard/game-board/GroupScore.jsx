import { useEffect, useRef, useState } from 'react';
import { Table } from 'rsuite';
import { toast } from 'react-toastify';
const { Column, HeaderCell, Cell } = Table;

import RsuiteTableSkeletonLoader from '../../../../Components/RsuiteTableSkeletonLoader';
import GroupScoreInputDialog from '../../../../Components/DialogBoxes/GroupScoreInputDialog';
import useGameController from '../../../../api-controllers/game-controller-hook';
import handleErrMsg from '../../../../Utils/error-handler';
import { useOngoingRound } from '../../../../app-context/ongoing-game-context';

const CustomHeader = ({ title, par }) => (
    <div className='d-flex flex-column justify-content-center align-items-center fw-bold text-dark'>
        <label className='fs-5'>{title}</label>
        <label>Par {par}</label>
    </div>
);

const CustomNameCell = ({ rowData, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 2 }} fullText>
        <div className='d-flex flex-column justify-content-center align-items-start text-dark'>
            <label className='fw-bold'>{rowData.name}</label>
            <small className="text-muted">HCP {rowData.hcp}</small>
        </div>
    </Cell>
);

const GroupScore = ({columns = [], myGroup}) => {
    const controllerRef = useRef(new AbortController());
    const { updateGroupScores, updateGroupContestScores } = useGameController();
    const { ongoingGame, scores, setScores, holeProps } = useOngoingRound();
    const game_id = ongoingGame()?.id;
    const playerScores = scores();
    const hp = holeProps();

    const [showGroupScoreInputDialog, setShowGroupScoreInputDialog] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");
	const [selectedCol, setSelectedCol] = useState(-1);
	const [myGroupScores, setMyGroupScores] = useState([]);
	const [selectedHoleProp, setSelectedHoleProp] = useState(null);
    const [networkRequest, setNetworkRequest] = useState(false);

    useEffect(() => {
        setNetworkRequest((playerScores.length > 0) ? false : true);
        if(myGroup){
            // filter out players in same current user group
            const group = playerScores.filter(score => score.group === myGroup);
            setMyGroupScores(group);
        }
    }, [playerScores, myGroup]);

    const columnClicked = (col, holeProp) => {
        setDisplayMsg(`Hole ${col.label}`)
        setShowGroupScoreInputDialog(true);
        setSelectedCol(col.key);
        setSelectedHoleProp(holeProp);
    };
  
    const handleSubmitScores = async (scores) => {
        try {
            resetAbortController();
            const data = [];
            for (const key in scores) {
                if(scores[key] && scores[key] >= 0){
                    data.push({
                        player: parseInt(key),
                        score: parseInt(scores[key]),
                    })
                }
            }
            await updateGroupScores(controllerRef.current.signal, game_id, { hole_no: selectedCol, scores: data });
            for (const datum of data) {
                const found = playerScores.find(playerScore => playerScore.id === datum.player);
                if(found){
                    found.setHoleScore(selectedCol, datum.score);
                }
            }
            setScores(playerScores);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
            throw new Error(handleErrMsg(error).msg);
        }
    };
  
    const handleSubmitContestScores = async (contest, scores) => {
        try {
            resetAbortController();
            const data = [];
            for (const key in scores) {
                if(scores[key] && scores[key] >= 0){
                    data.push({
                        player: parseInt(key),
                        score: parseInt(scores[key]),
                    })
                }
            }
            await updateGroupContestScores(controllerRef.current.signal, game_id, { hole_no: selectedCol, scores: data, contest_id: contest.id });
            for (const datum of data) {
                const found = playerScores.find(playerScore => playerScore.id === datum.player);
                if(found){
                    found.setHoleContestScore(selectedCol, datum.score);
                }
            }
            setScores(playerScores);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
            throw new Error(handleErrMsg(error).msg);
        }
    };

	const handleCloseModal = () => {
        setShowGroupScoreInputDialog(false);
    };

    const resetAbortController = () => {
        // Cancel previous request if it exists
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
    };
    
    return (
        <section>
            <Table loading={networkRequest} rowKey="id" data={myGroupScores} affixHeader affixHorizontalScrollbar autoHeight={true} hover={true} headerHeight={80}
                renderLoading={() => <RsuiteTableSkeletonLoader withPlaceholder={true} rows={10} cols={5} />} >
                    
                {columns.map((column, idx) => {
                    const { key, label, ...rest } = column;
                    if(idx === 0){
                        return (
                            <Column {...rest} key={key} >
                                <HeaderCell className='fw-bold text-dark'>{label}</HeaderCell>
                                <CustomNameCell
                                    dataKey={key}
                                    name={''}
                                    hcp={''}
                                />
                            </Column>
                        )
                    }
                    if(idx > 1){
                        return (
                            <Column {...rest} key={key} >
                                <HeaderCell>
                                    <CustomHeader title={label} par={hp[key]?.par} />
                                </HeaderCell>
                                <Cell
                                    dataKey={key}
                                    style={{ padding: 6 }}
                                    onClick={() => columnClicked(column, hp[key])}
                                />
                            </Column>
                        )
                    }
                    return (
                        <Column {...rest} key={key} fullText>
                            <HeaderCell className='fw-bold text-dark'>{label}</HeaderCell>
                            <Cell dataKey={key} style={{ padding: 6, fontWeight: 'bold' }} />
                        </Column>
                    );
                })}
            </Table>

            <GroupScoreInputDialog
				show={showGroupScoreInputDialog}
				handleClose={handleCloseModal}
				message={displayMsg}
                holeProp={selectedHoleProp}
				networkRequest={networkRequest}
				players={myGroupScores}
                selectedCol={selectedCol}
                handleSubmitScores={handleSubmitScores}
                handleSubmitContestScores={handleSubmitContestScores}
			/>
        </section>
    )
}

export default GroupScore;