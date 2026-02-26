import React from 'react'
import { Table } from 'rsuite';

import ImageComponent from '../../../../Components/ImageComponent';
import RsuiteTableSkeletonLoader from '../../../../Components/RsuiteTableSkeletonLoader';
import IMAGES from '../../../../assets/images';
import { useGame } from '../../../../app-context/game-context';
import { useAuthUser } from '../../../../app-context/user-context';
import cryptoHelper from '../../../../Utils/crypto-helper';
const { Column, HeaderCell, Cell } = Table;

const columns = [
    {
        key: 'ProfileImgKeyhash',
        label: 'Avatar',
        fixed: true,
        width: 70,
    },
    {
        key: 'name',
        label: 'Name',
        fixed: true,
        flexGrow: 1,
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

const ImageCell = ({ rowData, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
        <div
        style={{
            width: 50,
            height: 50,
            // background: '#f5f5f5',
            borderRadius: 6,
            marginTop: 2,
            overflow: 'hidden',
            display: 'inline-block'
        }}
        >
            {rowData?.ProfileImgKeyhash && <ImageComponent image={rowData?.ProfileImgKeyhash} width={'40px'} height={'40px'} round={true} key_id={rowData?.ProfileImgKeyhash.key_hash} />}
            {!rowData?.ProfileImgKeyhash && <img src={IMAGES.member_icon} alt ="Avatar" className="rounded-circle" width={40} height={40} />}
        </div>
  </Cell>
);

const PlayerList = ({networkRequest}) => {
    const { scores } = useGame();
    const { authUser } = useAuthUser();
    const user = authUser();
    const playerScores = scores();

    const handleTableRowClicked = (rowData) => {
        const decrypted_id = cryptoHelper.decryptData(user.id);
        if(rowData.id == decrypted_id){
            // doesn't make sense for current logged in user to click on themself
            return;
        }
        console.log(rowData);
    };

    return (
        <Table loading={networkRequest} rowKey="id" data={playerScores} affixHeader affixHorizontalScrollbar autoHeight={true} hover={true}
            renderLoading={() => <RsuiteTableSkeletonLoader withPlaceholder={true} rows={10} cols={5} />} onRowClick={handleTableRowClicked} >
                
            {columns.map((column, idx) => {
                const { key, label, ...rest } = column;
                if(idx === 0){
                    return (
                        <Column {...rest} key={key} fullText>
                            <HeaderCell className='fw-bold text-dark'>{label}</HeaderCell>
                            <ImageCell dataKey={key} />
                        </Column>
                    )
                }
                return (
                    <Column {...rest} key={key} >
                        <HeaderCell className='fw-bold text-dark'>{label}</HeaderCell>
                        <CustomNameCell dataKey={key} />
                    </Column>
                );
            })}
        </Table>
    )
}

export default PlayerList;