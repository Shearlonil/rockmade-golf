import { useEffect, useState } from 'react';
import { Table } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import RsuiteTableSkeletonLoader from '../../../../Components/RsuiteTableSkeletonLoader';
import { useOngoingRound } from '../../../../app-context/ongoing-game-context';

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
    const { scores } = useOngoingRound();
    const playerScores = scores();

    const [leaderboardsScores, setLeaderboardsScores] = useState([]);
    
    useEffect(() => {
        const arr = [...playerScores];
        arr.sort((a, b) => (a.lbParVal - b.lbParVal) || (a.hcp - b.hcp)).forEach((score, idx) => score.position = idx + 1);
        setLeaderboardsScores(arr);
    }, [playerScores]);
    
    return (
        <Table loading={networkRequest} rowKey="id" data={leaderboardsScores} affixHeader affixHorizontalScrollbar autoHeight={true} hover={true} headerHeight={80}
            renderLoading={() => <RsuiteTableSkeletonLoader withPlaceholder={true} rows={10} cols={5} />} >
                
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
                                // onClick={() => columnClicked(column, holeProps[key])}
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
    )
}

export default LeaderBoards;