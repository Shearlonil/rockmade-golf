import { Table } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

const CustomHeader = ({ title, holeProps, idx }) => {
    if(idx === 0){
        return <div className='d-flex flex-column align-items-center w-100 text-dark gap-2'>
            <label className='fw-bold text-danger'>{title}</label>
            <label>Handicap</label>
            <label>Par</label>
        </div>
    }
    return <div className='d-flex flex-column align-items-center w-100 text-dark gap-2'>
        <label className='fw-bold text-danger'>{title}</label>
        <label>{holeProps[idx]?.hcp_idx}</label>
        <label>{holeProps[idx]?.par}</label>
    </div>
};

const ScoreCard = ({columns = [], holeProps, totalPar, player, tableData = []}) => {
    return (
        <div>
            <Table rowKey="id" data={tableData} affixHeader affixHorizontalScrollbar autoHeight={true} hover={true} headerHeight={90} >
                {columns?.map((column, idx) => {
                    const { key, label, ...rest } = column;
                    return (
                        <Column {...rest} key={key} fullText className='d-flex flex-column align-items-center '>
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
                    Score: <span className='fw-bold'> {player?.score}/{player?.scoreLessHcp} </span>
                </span>
                <span>
                    Position: <span className='fw-bold'> {player?.position} </span>
                </span>
            </div>
        </div>
    );
}

export default ScoreCard;