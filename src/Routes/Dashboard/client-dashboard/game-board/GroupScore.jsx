import { useEffect, useRef, useState } from 'react';
import { Table } from 'rsuite';
import { toast } from 'react-toastify';
const { Column, HeaderCell, Cell } = Table;

import RsuiteTableSkeletonLoader from '../../../../Components/RsuiteTableSkeletonLoader';
import GroupScoreInputDialog from '../../../../Components/DialogBoxes/GroupScoreInputDialog';
import useGameController from '../../../../api-controllers/game-controller-hook';
import handleErrMsg from '../../../../Utils/error-handler';

const CustomHeader = ({ title, par }) => (
    <div className='d-flex flex-column justify-content-center align-items-center fw-bold text-dark'>
        <label className='fs-5'>{title}</label>
        <label>Par {par}</label>
    </div>
);

const GroupScore = ({columns = [], game_id, playerScores, holeProps}) => {
    const controllerRef = useRef(new AbortController());
    const { updateGroupScores } = useGameController();

    const [showGroupScoreInputDialog, setShowGroupScoreInputDialog] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");
	const [selectedCol, setSelectedCol] = useState(-1);
    const [networkRequest, setNetworkRequest] = useState(false);

    useEffect(() => {
        setNetworkRequest((playerScores && playerScores.length > 0) ? false : true);
    }, [playerScores]);

    const handleChange = (id, key, value) => {
        const nextData = Object.assign([], playerScores);
        nextData.find(item => item.id === id)[key] = value;
        // setCourses(nextData);
    };

    const handleEdit = id => {
        const nextData = Object.assign([], playerScores);
        const activeItem = nextData.find(item => item.id === id);

        activeItem.mode = activeItem.mode ? null : 'EDIT';

        // setCourses(nextData);
    };

    const columnClicked = col => {
        setDisplayMsg(`Hole ${col.label}`)
        setShowGroupScoreInputDialog(true);
        setSelectedCol(col.key);
    };
  
    const handleSubmitScores = async (scores) => {
        try {
            resetAbortController();
            setNetworkRequest(true);
            await updateGroupScores(controllerRef.current.signal, game_id, scores);
            setNetworkRequest(false);
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
            <Table loading={networkRequest} rowKey="id" data={playerScores} affixHeader affixHorizontalScrollbar autoHeight={true} hover={true} headerHeight={80}
                renderLoading={() => <RsuiteTableSkeletonLoader withPlaceholder={true} rows={10} cols={5} />} >
                    
                {columns.map((column, idx) => {
                    const { key, label, ...rest } = column;
                    if(idx > 1){
                        return (
                            <Column {...rest} key={key} >
                                <HeaderCell>
                                    <CustomHeader title={label} par={holeProps[key]?.par} />
                                </HeaderCell>
                                <Cell
                                    dataKey={key}
                                    style={{ padding: 6 }}
                                    onClick={() => columnClicked(column)}
                                />
                            </Column>
                        )
                    }
                    return (
                        <Column {...rest} key={key} fullText>
                            <HeaderCell className='fw-bold text-dark'>{label}</HeaderCell>
                            <Cell dataKey={key} style={{ padding: 6 }} />
                        </Column>
                    );
                })}
            </Table>

            <GroupScoreInputDialog
				show={showGroupScoreInputDialog}
				handleClose={handleCloseModal}
				message={displayMsg}
				networkRequest={networkRequest}
				players={playerScores}
                selectedCol={selectedCol}
                handleSubmitScores={handleSubmitScores}
			/>
        </section>
    )
}

export default GroupScore;