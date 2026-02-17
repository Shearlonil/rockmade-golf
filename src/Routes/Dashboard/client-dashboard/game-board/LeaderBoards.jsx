import { useEffect, useState } from 'react';
import { Table } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import RsuiteTableSkeletonLoader from '../../../../Components/RsuiteTableSkeletonLoader';
import { useOngoingRound } from '../../../../app-context/ongoing-game-context';
import PlayerLeaderboardScoresDialog from '../../../../Components/DialogBoxes/PlayerLeaderboardScoresDialog';

const rowKey = 'id';
const columns = [
    {
        key: 'position',
        label: '#',
        fixed: true,
        width: 50
    },
    {
        key: 'name',
        label: 'Name',
        fixed: true,
        width: 200,
    },
    {
        key: 'score',
        label: 'Score',
        width: 100
    },
    {
        key: 'toParVal',
        label: 'TO PAR',
        width: 100
    },
];

const CustomNameCell = ({ rowData, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 2 }} fullText>
        <div className='d-flex flex-column justify-content-center align-items-start text-dark'>
            <label className='fw-bold'>{rowData.name}</label>
            <small className="text-muted">HCP {rowData.hcp}</small>
        </div>
    </Cell>
);

const LeaderBoards = ({networkRequest}) => {
    const { scores, holeProps, ongoingGame } = useOngoingRound();
    const playerScores = scores();
    const hp = holeProps();
    const game = ongoingGame();

    const [leaderboardsScores, setLeaderboardsScores] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [showPlayerScoresModal, setShowPlayerScoresModal] = useState(false);
    const [totalPar, setTotalPar] = useState(0);
    const [scoreDetailsCols, setScoreDetailsCols] = useState([
        {
            key: 'txtScore',
            label: 'Hole',
            fixed: true,
            width: 80
        },
    ]);
    
    useEffect(() => {
        const arr = [...playerScores];
        arr.sort((a, b) => (a.lbParVal - b.lbParVal) || (a.hcp - b.hcp)).forEach((score, idx) => score.position = idx + 1);
        setLeaderboardsScores(arr);
        switch (game.hole_mode) {
            case 1:
                buildGroupScoreTableColumns(1, 18, holeProps);
                break;
            case 2:
                buildGroupScoreTableColumns(1, 9, holeProps);
                break;
            case 3:
                buildGroupScoreTableColumns(10, 18, holeProps);
                break;
        }
    }, [playerScores, game]);

    const handleExpanded = (rowData) => {
        setSelectedPlayer(rowData);
        setShowPlayerScoresModal(true);
    };

	const handleCloseModal = () => {
        setShowPlayerScoresModal(false);
    };

    const buildGroupScoreTableColumns = (start, end) => {
        const arr = [];
        let totalPar = 0;
        for(let i = start; i <= end; i++){
            arr.push({
                key: i,
                label: i,
                width: 30,
            });
            totalPar += hp[i]?.par
        }
        setTotalPar(totalPar);
        setScoreDetailsCols([...scoreDetailsCols, ...arr]);
    };
    
    return (
        <span>
            <Table loading={networkRequest} rowKey={rowKey} data={leaderboardsScores} affixHeader affixHorizontalScrollbar autoHeight={true} hover={true} headerHeight={80}
                renderLoading={() => <RsuiteTableSkeletonLoader withPlaceholder={true} rows={10} cols={5} />} onRowClick={data => handleExpanded(data) } >
                    
                {columns.map((column, idx) => {
                    const { key, label, ...rest } = column;
                    if(idx === 1){
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
                    return (
                        <Column {...rest} key={key} fullText>
                            <HeaderCell className='fw-bold text-dark'>{label}</HeaderCell>
                            <Cell dataKey={key} style={{ padding: 6, fontWeight: 'bold' }} />
                        </Column>
                    );
                })}
            </Table>

            <PlayerLeaderboardScoresDialog player={selectedPlayer} show={showPlayerScoresModal} handleClose={handleCloseModal} columns={scoreDetailsCols} holeProps={hp} totalPar={totalPar} />
        </span>
    )
}

export default LeaderBoards;