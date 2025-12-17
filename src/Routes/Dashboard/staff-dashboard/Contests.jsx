import { useEffect, useRef, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { IoMdAddCircle } from "react-icons/io";
import { VscEdit, VscSave, VscRemove } from 'react-icons/vsc';
import { TbRestore } from "react-icons/tb";
import { Table, IconButton, Input, NumberInput, DatePicker } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import { useAuthUser } from "../../../app-context/user-context";
import useContestController from "../../../api-controllers/contest-controller-hook";
import handleErrMsg from "../../../Utils/error-handler";
import IMAGES from "../../../assets/images";
import ConfirmDialog from "../../../Components/DialogBoxes/ConfirmDialog";
import PaginationLite from "../../../Components/PaginationLite";
import { statusOptions, pageSizeOptions } from "../../../Utils/data";
import RsuiteTableSkeletonLoader from "../../../Components/RsuiteTableSkeletonLoader";
import InputDialog from '../../../Components/DialogBoxes/InputDialog';
import cryptoHelper from "../../../Utils/crypto-helper";

const columns = [
    {
        key: 'name',
        label: 'Name',
        fixed: true,
        flexGrow: 2,
        // width: 200
    },
    {
        key: 'fname',
        label: 'Creator',
        flexGrow: 1,
        // width: 100
    },
    {
        key: 'createdAt',
        label: 'Created At',
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

const ActionCell = ({ rowData, dataKey, onEdit, changeStatus, onRestore, onSave, ...props }) => {
    return (
        <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px', width: '400px' }}>
            <IconButton appearance="subtle" icon={rowData.mode === 'EDIT' ? <VscSave /> : <VscEdit />} onClick={() => { onEdit(rowData.id); }}/>
            <IconButton appearance="subtle" icon={rowData.status == true ? <VscRemove /> : <TbRestore />} onClick={() => { changeStatus(rowData); }}  />
            <IconButton icon={<VscSave color='green' />} onClick={() => { onSave(rowData); }}  />
        </Cell>
  );
};

const Contests = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { paginateFetch, contestSearch, activeContestsPageInit, status, update, create } = useContestController();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
    const [contestOptions, setContestOptions] = useState([]);
    const [contestStatus, setContestStatus] = useState(true);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showInputModal, setShowInputModal] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");
    const [confirmDialogEvtName, setConfirmDialogEvtName] = useState(null);
    const [editedContest, setEditedContest] = useState(null);
        
    //	for pagination
    const [pageSize, setPageSize] = useState(pageSizeOptions[2].value);
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    
    //  data returned from DataPagination
    const [contests, setContests] = useState([]);
    
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
            const response = await activeContestsPageInit(controllerRef.current.signal, pageSize);

            //	check if the request to fetch pkg doesn't fail before setting values to display
            if(response && response.data){
                const { count, results } = response.data;
                setContestOptions(results?.map(course => ({label: course.name, value: course})));
                if(results && count){
                    setContests(results);
                    setTotalItemsCount(count);
                }
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

    const asyncContestSearch = async (inputValue, callback) => {
        /*  refs: https://stackoverflow.com/questions/65963103/how-can-i-setup-react-select-to-work-correctly-with-server-side-data-by-using  */
        try {
            setNetworkRequest(true);
            resetAbortController();
            const response = await contestSearch(controllerRef.current.signal, {inputValue, contestStatus});
            const results = response.data.map(course => ({label: course.name, value: course}));
            setContestOptions(results);
            setContests(response.data);
            setTotalItemsCount(0);
            setNetworkRequest(false);
            callback(results);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const handleContestChange = (val) => {
        setTotalItemsCount(0);
        setContests( val ? [val.value] : [] );
    };

    const handleStatusChange = async (val) => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            const response = await paginateFetch(controllerRef.current.signal, {page: 1, pageSize, contestStatus: val.value});
            const { count, results } = response.data;
            setContestOptions(results.map(course => ({label: course.name, value: course})));
            setContests(results);
            setCurrentPage(1);
            setTotalItemsCount(count);
            setContestStatus(val.value);
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

    const handlePageSizeChanged = async (val) => {
        // whenever page size changes, make a fresh request using necessary params
        try {
            setNetworkRequest(true);
            resetAbortController();
            const response = await paginateFetch(controllerRef.current.signal, {page: 1, pageSize: val.value, contestStatus});
            const { count, results } = response.data;
            setContestOptions(results.map(course => ({label: course.name, value: course})));
            setContests(results);
            setCurrentPage(1);
            setTotalItemsCount(count);
            setPageSize(val.value);
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

    const setPageChanged = async (pageNumber) => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            const response = await paginateFetch(controllerRef.current.signal, {page: pageNumber, pageSize, contestStatus});
            const { count, results } = response.data;
            setContestOptions(results.map(course => ({label: course.name, value: course})));
            setContests(results);
            setCurrentPage(pageNumber);
            setTotalItemsCount(count);
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

	const delContest = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            await status(controllerRef.current.signal, {id: editedContest.id, status: false});
            setContests(contests.filter(course => editedContest.id !== course.id));
            setTotalItemsCount(contests.length - 1);
            setEditedContest(null);
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

	const restoreContest = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            await status(controllerRef.current.signal, {id: editedContest.id, status: true});
            setContests(contests.filter(course => editedContest.id !== course.id));
            setTotalItemsCount(contests.length - 1);
            setEditedContest(null);
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

    const updateContest = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            await update(controllerRef.current.signal, {id: editedContest.id, name: editedContest.name, location: editedContest.location});
            setEditedContest(null);
            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    }

    const handleChange = (id, key, value) => {
        const nextData = Object.assign([], contests);
        nextData.find(item => item.id === id)[key] = value;
        setContests(nextData);
    };

    const handleEdit = id => {
        const nextData = Object.assign([], contests);
        const activeItem = nextData.find(item => item.id === id);

        activeItem.mode = activeItem.mode ? null : 'EDIT';

        setContests(nextData);
    };

    const handleChangeStatus = course => {
        if(course.status){
            setConfirmDialogEvtName('remove');
            setDisplayMsg(`Delete ${course.name} from active list?`);
            setShowConfirmModal(true);
            setEditedContest(course);
        }else {
            setConfirmDialogEvtName('restore');
            setDisplayMsg(`Restore ${course.name} from list of inactive contests?`);
            setShowConfirmModal(true);
            setEditedContest(course);
        }
    };
  
    const handleSave = async (course) => {
        setConfirmDialogEvtName('save');
        setDisplayMsg(`Save changes made to ${course.name}?`);
        setShowConfirmModal(true);
        setEditedContest(course);
    };

    const handleAddContest = () => {
        setDisplayMsg('Enter Contest name');
        setShowInputModal(true);
    }

	const handleCloseModal = () => {
        setShowConfirmModal(false);
        setShowInputModal(false);
    };
  
    const handleConfirm = async () => {
        setShowConfirmModal(false);
        switch (confirmDialogEvtName) {
            case "remove":
                delContest();
                break;
            case "restore":
                restoreContest();
                break;
            case 'save':
                updateContest();
        }
    };
	
	const handleInputOK = async (str) => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            const response = await create(controllerRef.current.signal, str);
            const c = response.data;
            c.fname = user.firstName;
            setContests([...contests, c]);
            setShowInputModal(false);
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
                <div className=" col-12 col-md-2 mt-4">
                    <Button variant="success" className="w-100 fw-bold d-flex gap-3 align-items-center justify-content-center" onClick={handleAddContest}>
                        <IoMdAddCircle size='32px' /> Add
                    </Button>
                </div>
            </Row>
            {/* NOTE: setting z-index of this row because of rsuite table which conflicts the drop down menu of react-select */}
            <Row className="card shadow border-0 rounded-3 z-3">
                <div className="card-body row ms-0 me-0">
                    <div className="d-flex gap-3 align-items-center col-12 col-md-4 mb-3">
                        <img src={IMAGES.cup} alt ="Avatar" className="rounded-circle" width={50} height={50} />
                        <span className="text-danger fw-bold h2">Golf Contests</span>
                    </div>

                    <div className="d-flex flex-column gap-2 align-items-center col-12 col-md-4 mb-3">
                        <span className="align-self-start fw-bold">Search</span>
                        <AsyncSelect
                            className="text-dark w-100"
                            isClearable
                            // getOptionLabel={getOptionLabel}
                            getOptionValue={(option) => option}
                            // defaultValue={initialObject}
                            defaultOptions={contestOptions}
                            cacheOptions
                            loadOptions={asyncContestSearch}
                            onChange={(val) => handleContestChange(val) }
                        />
                    </div>

                    <div className="d-flex gap-4 align-items-center justify-content-end col-12 col-md-4 mb-3">
                        <div className="d-flex flex-column w-50 gap-2">
                            <span className="align-self-start fw-bold">Status</span>
                            <Select
                                required
                                name="filter"
                                placeholder="Filter..."
                                className="text-dark w-100"
                                defaultValue={statusOptions[0]}
                                options={statusOptions}
                                onChange={(val) => { handleStatusChange(val) }}
                            />
                        </div>
                        <div className="d-flex flex-column w-50 gap-2">
                            <span className="align-self-start fw-bold">Page Size</span>
                            <Select
                                required
                                name="filter"
                                placeholder="Filter..."
                                className="text-dark w-100"
                                defaultValue={pageSizeOptions[2]}
                                options={pageSizeOptions}
                                onChange={(val) => { handlePageSizeChanged(val) }}
                            />
                        </div>
                    </div>
                </div>
            </Row>

            <Table loading={networkRequest} rowKey="id" data={contests} affixHeader affixHorizontalScrollbar 
                renderLoading={() => <RsuiteTableSkeletonLoader withPlaceholder={true} rows={10} cols={5} />} 
                autoHeight={true} hover={true}>
                    
                {columns.map((column, idx) => {
                    const { key, label, ...rest } = column;
                    if(idx < 1){
                        return (
                            <Column {...rest} key={key}>
                                <HeaderCell>{label}</HeaderCell>
                                <EditableCell
                                    fullText
                                    dataKey={key}
                                    dataType="string"
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
                    <ActionCell onEdit={handleEdit} changeStatus={handleChangeStatus} onSave={handleSave} />
                </Column>
            </Table>
            <Row className="mt-3">
                <PaginationLite
                    itemCount={totalItemsCount}
                    pageSize={pageSize}
                    setPageChanged={setPageChanged}
                    pageNumber={currentPage}
                />
            </Row>
			<ConfirmDialog
				show={showConfirmModal}
				handleClose={handleCloseModal}
				handleConfirm={handleConfirm}
				message={displayMsg}
			/>
            <InputDialog
                show={showInputModal}
                handleClose={handleCloseModal}
                handleConfirm={handleInputOK}
                message={displayMsg}
                networkRequest={networkRequest}
            />
        </section>
    )
}

export default Contests;