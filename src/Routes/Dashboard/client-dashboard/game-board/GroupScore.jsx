import { VscEdit, VscSave } from 'react-icons/vsc';
import { Table, IconButton, Input, NumberInput, DatePicker } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import RsuiteTableSkeletonLoader from '../../../../Components/RsuiteTableSkeletonLoader';

const columns = [
    {
        key: 'name',
        label: 'Name',
        fixed: true,
        flexGrow: 2,
        // width: 200
    },
    {
        key: 'parHit',
        label: '',
        fixed: true,
        flexGrow: 1,
        // width: 200
    },
    {
        key: 'location',
        label: 'Location',
        flexGrow: 1,
        // fixed: true,
        // width: 200
    },
    {
        key: 'no_of_holes',
        label: 'Number Of Holes',
        flexGrow: 1,
        // width: 100
    },
    {
        key: 'createdAt',
        label: 'Created At',
        flexGrow: 1,
        // width: 100
    },
    {
        key: 'fname',
        label: 'Creator',
        flexGrow: 1,
        // width: 100
    },
];

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

const ActionCell = ({ rowData, dataKey, onEdit, onSave, onViewCourse, ...props }) => {
    return (
        <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px', width: '400px' }}>
            <IconButton appearance="subtle" icon={rowData.mode === 'EDIT' ? <VscSave /> : <VscEdit />} onClick={() => { onEdit(rowData.id); }}/>
            <IconButton icon={<VscSave color='green' />} onClick={() => { onSave(rowData); }}  />
        </Cell>
  );
};

const GroupScore = ({holeMode, networkRequest, playerScores}) => {

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
        <Table loading={networkRequest} rowKey="id" data={playerScores} affixHeader affixHorizontalScrollbar autoHeight={true} hover={true}
            renderLoading={() => <RsuiteTableSkeletonLoader withPlaceholder={true} rows={10} cols={5} />} >
                
            {columns.map((column, idx) => {
                const { key, label, ...rest } = column;
                if(idx > 1){
                    return (
                        <Column {...rest} key={key}>
                            <HeaderCell>{label}</HeaderCell>
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
                        <HeaderCell>{label}</HeaderCell>
                        <Cell dataKey={key} style={{ padding: 6 }} />
                    </Column>
                );
            })}
            <Column width={150} >
                <HeaderCell>Actions...</HeaderCell>
                <ActionCell onEdit={handleEdit} onSave={handleSave} />
            </Column>
        </Table>
    )
}

export default GroupScore;