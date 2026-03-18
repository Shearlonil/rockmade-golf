import { useState } from "react";
import { Modal } from "react-bootstrap"
import { TbChecks } from "react-icons/tb";
import { RiAddBoxFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { VscRemove } from 'react-icons/vsc';
import { VscEdit, VscSave } from 'react-icons/vsc';
import { Table, IconButton, Input, NumberInput, DatePicker } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import RsuiteTableSkeletonLoader from "../RsuiteTableSkeletonLoader";
import { toast } from "react-toastify";

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
                onEdit?.(rowData.idx);
            }}
        >
            {editing ? (
                <Field
                    defaultValue={value}
                    onChange={value => {
                        onChange?.(rowData.idx, dataKey, value);
                    }}
                />
            ) : (
                text
            )}
        </Cell>
    );
};

const ActionCell = ({ rowData, dataKey, onEdit, onViewGame, onDelete, onSave, ...props }) => {
    return (
        <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px', width: '400px' }}>
            <IconButton appearance="subtle" icon={rowData.mode === 'EDIT' ? <VscSave /> : <VscEdit />} onClick={() => { onEdit(rowData.idx); }}/>
            <IconButton icon={<VscSave color='green' />} onClick={() => { onSave(rowData); }}  />
            <IconButton appearance="subtle" icon={<VscRemove />} onClick={() => { onDelete(rowData); }}  />
        </Cell>
  );
};

const PlanBenefitsDialog = ({ show, handleClose, data, handleDeleteBenefit, handleBenefitUpdate, handleBenefitAdd, message }) => {
    const [benefits, setBenefits] = useState([]);
    const [selectedBenefit, setSelectedBenefit] = useState(null);
    const [msg, setMsg] = useState(null);
    const [confirmEvt, setConfirmEvt] = useState(0);    // 1 => add benefit, 2 => update benefit, 3 => delelte benefit
    const [networkRequest, setNetworkRequest] = useState(false);

    const minimizeModal = () => {
        handleClose();
        handleCancel();
        setBenefits([]);
    }

    const modalLoaded = () => {
        const temp = [...data.SubPlanBenefits];
        temp.forEach((t, idx) => t.idx = idx + 1);
        setBenefits(temp);
    };

    const addBenefit = async () => {
        try {
            setNetworkRequest(true);
            await handleBenefitAdd(selectedBenefit);
            setSelectedBenefit(selectedBenefit);
            handleCancel();
            setNetworkRequest(false);
        } catch (error) {
            // do nothing
            setNetworkRequest(false);
        }
    }

    const updateBenefit = async () => {
        try {
            setNetworkRequest(true);
            await handleBenefitUpdate(selectedBenefit);
            handleCancel();
            setNetworkRequest(false);
        } catch (error) {
            // do nothing
            setNetworkRequest(false);
        }
    }

    const delBenefit = async () => {
        try {
            setNetworkRequest(true);
            await handleDeleteBenefit(selectedBenefit);
            const temp = [...benefits];
            temp.splice(selectedBenefit.idx - 1, 1);
            temp.forEach((t, idx) => t.idx = idx + 1);
            setBenefits(temp);
            handleCancel();
            setNetworkRequest(false);
        } catch (error) {
            // do nothing
            setNetworkRequest(false);
        }
    }

    const handleChange = (idx, key, value) => {
        const nextData = Object.assign([], benefits);
        nextData.find(sub => sub.idx === idx)[key] = value;
        setBenefits(nextData);
    };
  
    const handleSave = (benefit) => {
        if(benefit.id){
            // updating
            setConfirmEvt(2);
        }else {
            // new benefit added
            setConfirmEvt(1);
        }
        setMsg(`Apply changes to No. ${benefit.idx}?`);
        setSelectedBenefit(benefit);
    };

    const handleBenefitDelete = (benefit) => {
        if(benefits.length === 1){
            // AT LEAST ONE BENEFIT REQUIRED
            toast.info(`At least one benefit is required for ${message}`);
            return;
        }
        if(benefit.id){
            setConfirmEvt(3);
            setMsg(`Delete No. ${benefit.idx}?`);
            setSelectedBenefit(benefit);
        }else {
            const temp = [...benefits];
            temp.splice(benefits.length - 1, 1);
            setBenefits(temp);
        }
    };

    const handleEdit = idx => {
        const nextData = Object.assign([], benefits);
        const activeSub = nextData.find(sub => sub.idx === idx);

        activeSub.mode = activeSub.mode ? null : 'EDIT';

        setBenefits(nextData);
    };

    const handleConfirm = () => {
        switch (confirmEvt) {
            case 1:
                addBenefit();
                break;
            case 2:
                updateBenefit();
                break;
            case 3:
                delBenefit();
                break;
        }
        setSelectedBenefit(null);
        setMsg(null);
        setConfirmEvt(0);
    };

    const handleCancel = () => {
        setSelectedBenefit(null);
        setMsg(null);
        setConfirmEvt(0);
    };

    const handleAddBenefit = () => {
        // AT MOST 10 BENEFITS
        if(benefits.length === 10){
            toast.info(`At most 10 benefits allowed for ${message}`);
            return;
        }
        setBenefits([...benefits, {idx: benefits.length + 1, desc: '', plan_id: benefits[0].plan_id, mode: 'EDIT'}]);
    };

    const confirmSection = () => {
        return <div className="d-flex justify-content-between w-100">
            <span className="text-danger fw-bold"> {msg} </span>
            <div className="d-flex gap-3">
                <TbChecks color="green" size={25} onClick={handleConfirm} />
                <MdCancel color="red" size={25} onClick={handleCancel} />
            </div>
        </div>
    }

    return (
        <Modal show={show} onHide={minimizeModal} onEntered={modalLoaded} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold text-primary">{message}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex gap-3 align-items-center mb-2">
                    <RiAddBoxFill color="green" size={35} className="shadow" onClick={handleAddBenefit} />
                    <span className="text-success fw-bold">add new benefit with max of 50 characters</span>
                </div>
                <Table loading={networkRequest} data={benefits} affixHeader affixHorizontalScrollbar autoHeight={true} hover={true}
                    renderLoading={() => <RsuiteTableSkeletonLoader withPlaceholder={false} rows={10} cols={5} />} >
                    <Column width={115} >
                        <HeaderCell className='fw-bold'> # </HeaderCell>
                        <Cell dataKey="idx" />
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell className='fw-bold'> Description </HeaderCell>
                        <EditableCell
                            fullText
                            dataKey='desc'
                            dataType="string"
                            onChange={handleChange}
                            onEdit={handleEdit}
                            style={{ padding: 6 }}
                        />
                    </Column>
                    <Column width={115} >
                        <HeaderCell className='fw-bold'>Actions...</HeaderCell>
                        <ActionCell dataKey="id"  onEdit={handleEdit} onSave={handleSave} onDelete={handleBenefitDelete} />
                    </Column>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                {selectedBenefit && confirmSection()}
            </Modal.Footer>
        </Modal>
    )
}

export default PlanBenefitsDialog;