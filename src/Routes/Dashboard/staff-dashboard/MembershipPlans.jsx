import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row } from 'react-bootstrap';
import { GrView } from "react-icons/gr";
import { VscEdit, VscSave } from 'react-icons/vsc';
import { Table, IconButton, Input, NumberInput, DatePicker, Toggle } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import { useAuthUser } from '../../../app-context/user-context';
import cryptoHelper from '../../../Utils/crypto-helper';
import handleErrMsg from '../../../Utils/error-handler';
import IMAGES from '../../../assets/images';
import RsuiteTableSkeletonLoader from '../../../Components/RsuiteTableSkeletonLoader';
import useSubPlansController from '../../../api-controllers/sub-plans-controller';
import ToggleSwitch from '../../../Components/ToggleSwitch';
import { CustomError } from '../../../Entities/CustomError';
import ConfirmDialog from '../../../Components/DialogBoxes/ConfirmDialog';

const columns = [
    {
        key: 'name',
        label: 'Name',
        fixed: true,
        flexGrow: 2,
        // width: 200
    },
    {
        key: 'amount',
        label: 'Amount',
        flexGrow: 1,
    },
    {
        key: 'duration_months',
        label: 'Duration (Months)',
        flexGrow: 1,
    },
    {
        key: 'discount',
        label: 'Discount',
        flexGrow: 1,
    },
    {
        key: 'popular',
        label: 'Popular',
        flexGrow: 1,
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

const ActionCell = ({ rowData, dataKey, onEdit, onViewGame, onSave, ...props }) => {
    return (
        <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px', width: '400px' }}>
            <IconButton appearance="subtle" icon={rowData.mode === 'EDIT' ? <VscSave /> : <VscEdit />} onClick={() => { onEdit(rowData.id); }}/>
            <IconButton icon={<VscSave color='green' />} onClick={() => { onSave(rowData); }}  />
            <IconButton icon={<GrView color='blue' />} onClick={() => { onViewGame(rowData); }}  />
        </Cell>
  );
};

const MembershipPlans = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { membershipPlans, changePopularPlan, updatePlan } = useSubPlansController();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");
    const [confirmDialogEvtName, setConfirmDialogEvtName] = useState(null);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [editedSub, setEditedSub] = useState(null);
    
    //  data for table presentation
    const [subs, setSubs] = useState([]);
        
    useEffect(() => {
        if(!user || cryptoHelper.decryptData(user.mode) !== '0'){
            navigate("/dashboard");
            return;
        }

        initialize();
        return () => {
            // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
            controllerRef.current.abort();
        };
    }, [location.pathname]);

    const initialize = async () => {
        try {
            controllerRef.current = new AbortController();
            setNetworkRequest(true);
            const response = await membershipPlans(controllerRef.current.signal);

            //	check if the request to fetch pkg doesn't fail before setting values to display
            if(response && response.data){
                setSubs(response.data)
            }

            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const updateMembershipPlan = async () => {
        try {
            resetAbortController();
            setNetworkRequest(true);
            await updatePlan(controllerRef.current.signal, editedSub);
            setEditedSub(null);
            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const toggle = async (checked, rowData) => {
        try {
            // can only set value to on. When any popular option for any plan is set to on, it auto deactivate previous on plan and set to off
            if(!checked){
                throw new CustomError('Skip');
            }
            resetAbortController();
            const id = cryptoHelper.encrypt(rowData.id.toString());
            const response = await changePopularPlan(controllerRef.current.signal, id);
            if (response && response.status === 200) {
                // set other popular fields to false
                const temp = Object.assign([], subs);
                temp.forEach(sub => sub.popular = false );
                temp.find(sub => sub.id === rowData.id)['popular'] = true;
                setSubs(temp);
            }
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            if (error.name === 'Skip') {
                // Error was intentionally thrown to prevent change in ToggleSwitch and no need to show toast
                throw new Error(null);
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
            // prevent change in ToggleSwitch
            throw new Error(null);
        }
    };
  
    const handleConfirm = async () => {
        setShowConfirmModal(false);
        switch (confirmDialogEvtName) {
            case "updatePlan":
                updateMembershipPlan();
                break;
        }
    };

	const handleCloseModal = () => {
        setShowConfirmModal(false);
    };

    const handleChange = (id, key, value) => {
        const nextData = Object.assign([], subs);
        nextData.find(sub => sub.id === id)[key] = value;
        setSubs(nextData);
    };
  
    const handleSave = (sub) => {
        setConfirmDialogEvtName('updatePlan');
        setDisplayMsg(`Save changes made to ${sub.name}?`);
        setShowConfirmModal(true);
        setEditedSub(sub);
    };

    const handleEdit = id => {
        const nextData = Object.assign([], subs);
        const activeSub = nextData.find(sub => sub.id === id);

        activeSub.mode = activeSub.mode ? null : 'EDIT';

        setSubs(nextData);
    };
  
    const handleView = (sub) => {
    };

    const resetAbortController = () => {
        // Cancel previous request if it exists
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
    };

    return (
        <section className='container d-flex flex-column gap-4' style={{minHeight: '60vh'}}>
            <Row className='d-flex align-items-center'>
                <div className="d-flex flex-wrap gap-4 align-items-center col-12 col-md-10 mt-4" >
                    <img src={IMAGES.image1} alt ="Avatar" className="rounded-circle" width={100} height={100} />
                    <div className="d-flex flex-wrap gap-2 fw-bold h2">
                        <span>{user.firstName}</span>
                        <span> {user.lastName}</span>
                    </div>
                </div>
                <div className="col-12 col-md-2 mt-4">
                    {/* <Button variant="success" className="w-100 fw-bold d-flex gap-3 align-items-center justify-content-center" onClick={handleAddSubPlan}>
                        <IoMdAddCircle size='32px' /> Add
                    </Button> */}
                </div>
            </Row>

            <Row className="card shadow border-0 rounded-3 z-3">
                <div className="card-body row ms-0 me-0">
                    <div className="d-flex gap-3 align-items-center col-12 mb-3">
                        <img src={IMAGES.subscribe} alt ="Avatar" className="rounded-circle" width={50} height={50} />
                        <span className="text-danger fw-bold h2">Subscription Plans</span>
                    </div>
                </div>
            </Row>

            <Table loading={networkRequest} data={subs} affixHeader affixHorizontalScrollbar autoHeight={true} hover={true}
                renderLoading={() => <RsuiteTableSkeletonLoader withPlaceholder={false} rows={10} cols={5} />} >
                    <Column flexGrow={2} fixed>
                        <HeaderCell className='fw-bold'> Name </HeaderCell>
                        <EditableCell
                            fullText
                            dataKey='name'
                            dataType="string"
                            onChange={handleChange}
                            onEdit={handleEdit}
                            style={{ padding: 6 }}
                        />
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell className='fw-bold'> Amount </HeaderCell>
                        <EditableCell
                            fullText
                            dataKey='amount'
                            dataType="number"
                            onChange={handleChange}
                            onEdit={handleEdit}
                            style={{ padding: 6 }}
                        />
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell className='fw-bold'> Duration (Months) </HeaderCell>
                        <EditableCell
                            fullText
                            dataKey='duration_months'
                            dataType="number"
                            onChange={handleChange}
                            onEdit={handleEdit}
                            style={{ padding: 6 }}
                        />
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell className='fw-bold'> Discount (%) </HeaderCell>
                        <EditableCell
                            fullText
                            dataKey='discount'
                            dataType="number"
                            onChange={handleChange}
                            onEdit={handleEdit}
                            style={{ padding: 6 }}
                        />
                    </Column>
                    <Column flexGrow={1} key='popular'>
                        <HeaderCell className='fw-bold'> Popular </HeaderCell>
                        <Cell dataKey='popular'>{rowData => <ToggleSwitch size={'sm'} data={rowData} checkedTxt="ON" unCheckedTxt="OFF" ticked={rowData.popular === true ? true : false} onChangeFn={toggle} />}</Cell>
                    </Column>
                <Column width={150} >
                    <HeaderCell className='fw-bold'>Actions...</HeaderCell>
                    <ActionCell dataKey="id"  onEdit={handleEdit} onSave={handleSave} onViewGame={handleView} />
                </Column>
            </Table>
			<ConfirmDialog
				show={showConfirmModal}
				handleClose={handleCloseModal}
				handleConfirm={handleConfirm}
				message={displayMsg}
			/>
        </section>
    )
}

export default MembershipPlans;