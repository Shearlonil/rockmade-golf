import { VscEdit, VscSave } from 'react-icons/vsc';
import { Table, IconButton, Input, NumberInput, DatePicker } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import RsuiteTableSkeletonLoader from '../../../../Components/RsuiteTableSkeletonLoader';

function toValueString(value, dataType) {
    return (dataType === 'date') ? value?.toLocaleDateString() : value;
}

const fieldMap = {
    string: Input,
    number: NumberInput,
    date: DatePicker
};

const EditableCell = ({ rowData, dataType, dataKey, onChange, onEdit, ...props }) => {
    const editing = rowData.mode === 'EDIT';

    const Field = fieldMap[dataType];
    const value = rowData[dataKey];
    const text = toValueString(value, dataType);

    return (
        <Cell
            {...props}
            className={editing ? 'table-cell-editing' : ''}
            onDoubleClick={() => {
                onEdit?.(rowData.id);
            }}
        >
            {editing ? (
                <Field
                    defaultValue={value}
                    onChange={value => {
                        onChange?.(rowData.id, dataKey, value);
                    }}
                />
            ) : (
                text
            )}
        </Cell>
    );
};

const CustomHeader = ({ title, par }) => (
    <div className='d-flex flex-column justify-content-center align-items-center fw-bold text-dark'>
        <label className='fs-5'>{title}</label>
        <label>Par {par}</label>
    </div>
);

const ActionCell = ({ rowData, dataKey, onEdit, onSave, onViewCourse, ...props }) => {
    return (
        <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px', width: '400px' }}>
            <IconButton appearance="subtle" icon={rowData.mode === 'EDIT' ? <VscSave /> : <VscEdit />} onClick={() => { onEdit(rowData.id); }}/>
            <IconButton icon={<VscSave color='green' />} onClick={() => { onSave(rowData); }}  />
        </Cell>
  );
};

const GroupScore = ({columns = [], networkRequest, playerScores, holeProps}) => {

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

    const handleChangeStatus = course => {
    };
  
    const handleSave = async (course) => {
    };
    
    return (
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
                            <EditableCell
                                dataKey={key}
                                dataType="number"
                                onChange={handleChange}
                                onEdit={handleEdit}
                                style={{ padding: 6 }}
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
    )
}

export default GroupScore;