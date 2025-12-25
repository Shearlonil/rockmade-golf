import { useEffect, useRef, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { IoMdAddCircle } from "react-icons/io";
import { GrView } from "react-icons/gr";
import { VscRemove } from 'react-icons/vsc';
import { TbRestore } from "react-icons/tb";
import { Table, IconButton } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import { useAuthUser } from "../../../../app-context/user-context";
import handleErrMsg from "../../../../Utils/error-handler";
import IMAGES from "../../../../assets/images";
import PaginationLite from "../../../../Components/PaginationLite";
import ConfirmDialog from "../../../../Components/DialogBoxes/ConfirmDialog";
import { pageSizeOptions, statusOptions } from "../../../../Utils/data";
import RsuiteTableSkeletonLoader from "../../../../Components/RsuiteTableSkeletonLoader";
import useStaffController from "../../../../api-controllers/staff-controller";
import StaffCreationDialog from "../../../../Components/DialogBoxes/StaffCreationDialog";
import useGenericController from "../../../../api-controllers/generic-controller-hook";
import StaffProfileViewDialog from "../../../../Components/DialogBoxes/StaffProfileViewDialog";

const columns = [
    {
        key: 'fname',
        label: 'First Name',
        fixed: true,
        flexGrow: 2,
        // width: 200
    },
    {
        key: 'lname',
        label: 'Last Name',
        flexGrow: 2,
        // width: 100
    },
    {
        key: 'phone',
        label: 'Phone',
        flexGrow: 1,
        // width: 100
    },
    {
        key: 'email',
        label: 'Email',
        flexGrow: 1,
        // width: 100
    },
    {
        key: 'sex',
        label: 'Gender',
        flexGrow: 1,
        // width: 100
    },
    {
        key: 'creator_fname',
        label: 'Creator',
        flexGrow: 1,
        // width: 100
    },
];

const ActionCell = ({ rowData, dataKey, changeStatus, onViewStaff, onRestore, ...props }) => {
    return (
        <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px', width: '400px' }}>
            <IconButton icon={<GrView color='green' />} onClick={() => { onViewStaff(rowData); }}  />
            <IconButton appearance="subtle" icon={rowData.status == true ? <VscRemove /> : <TbRestore />} onClick={() => { changeStatus(rowData); }}  />
        </Cell>
  );
};

const Staff = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { performGetRequests } = useGenericController();
    const { paginateFetch, staffSearch, status, register, updateRoles } = useStaffController();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
    const [userOptions, setUserOptions] = useState([]);
    const [authOptions, setAuthOptions] = useState([]);
    const [userStatus, setUserStatus] = useState(true);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showStaffCreationModal, setShowStaffCreationModal] = useState(false);
	const [showStaffProfileModal, setShowStaffProfileModal] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");
    const [confirmDialogEvtName, setConfirmDialogEvtName] = useState(null);
    const [editedUser, setEditedUser] = useState(null);
        
    //	for pagination
    const [pageSize, setPageSize] = useState(pageSizeOptions[2].value);
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    
    //  data returned from DataPagination
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        if(!user || !user.hasAuth(103)){
            toast.info('Account not authorized to view this page');
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
            const urls = [ `/staff/active/init/${pageSize}`, '/staff/auths' ];
            const response = await performGetRequests(urls, controllerRef.current.signal);
            const { 0: staffInitReq, 1: authReq } = response;

            //	check if the request to fetch pkg doesn't fail before setting values to display
            if(staffInitReq && staffInitReq.data){
                const { count, results } = staffInitReq.data;
                setUserOptions(results?.map(staff => ({label: staff.fname + " " + staff.lname, value: staff})));
                if(results && count){
                    setUsers(results);
                    setTotalItemsCount(count);
                }
            }

            if(authReq && authReq.data){
                setAuthOptions(authReq.data.map(auth => ({label: auth.name, value: auth})));
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

    const asyncUserSearch = async (inputValue, callback) => {
        /*  refs: https://stackoverflow.com/questions/65963103/how-can-i-setup-react-select-to-work-correctly-with-server-side-data-by-using  */
        try {
            setNetworkRequest(true);
            resetAbortController();
            const response = await staffSearch(controllerRef.current.signal, {inputValue, userStatus});
            const results = response.data.map(staff => ({label: staff.fname + " " + staff.lname, value: staff}));
            setUserOptions(results);
            setUsers(response.data);
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

    const handleStaffChange = (val) => {
        setTotalItemsCount(0);
        setUsers( val ? [val.value] : [] );
    };

    const handleStatusChange = async (val) => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            const response = await paginateFetch(controllerRef.current.signal, {page: 1, pageSize, userStatus: val.value});
            const { count, results } = response.data;
            setUserOptions(results.map(staff => ({label: staff.fname + " " + staff.lname, value: staff})));
            setUsers(results);
            setCurrentPage(1);
            setTotalItemsCount(count);
            setUserStatus(val.value);
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
            const response = await paginateFetch(controllerRef.current.signal, {page: 1, pageSize: val.value, userStatus});
            const { count, results } = response.data;
            setUserOptions(results.map(staff => ({label: staff.fname + " " + staff.lname, value: staff})));
            setUsers(results);
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
            const response = await paginateFetch(controllerRef.current.signal, {page: pageNumber, pageSize, userStatus});
            const { count, results } = response.data;
            setUserOptions(results.map(staff => ({label: staff.fname + " " + staff.lname, value: staff})));
            setUsers(results);
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

	const delUser = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            await status(controllerRef.current.signal, {id: editedUser.id, status: false});
            setUsers(users.filter(staff => editedUser.id !== staff.id));
            setTotalItemsCount(users.length - 1);
            setEditedUser(null);
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

	const restoreUser = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            await status(controllerRef.current.signal, {id: editedUser.id, status: true});
            setUsers(users.filter(staff => editedUser.id !== staff.id));
            setTotalItemsCount(users.length - 1);
            setEditedUser(null);
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

    const handleChangeStatus = staff => {
        if(staff.status){
            setConfirmDialogEvtName('remove');
            setDisplayMsg(`Delete ${staff.fname + " " + staff.lname} from active list?`);
            setShowConfirmModal(true);
            setEditedUser(staff);
        }else {
            setConfirmDialogEvtName('restore');
            setDisplayMsg(`Restore ${staff.fname + " " + staff.lname} from list of inactive users?`);
            setShowConfirmModal(true);
            setEditedUser(staff);
        }
    };

    const handleViewStaff = staff => {
        setEditedUser(staff);
        setDisplayMsg('Profile View');
        setShowStaffProfileModal(true);
    };

    const handleConfirmStaffCreation = staff => {
        setEditedUser(staff);
        setDisplayMsg('Create new account?');
        setConfirmDialogEvtName('create');
        setShowConfirmModal(true);
    };
  
    const handleCreateStaff = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            const authArr = editedUser.authorities?.map(auth => auth.value.code);
            const dto = {
                fname: editedUser.fname,
                lname: editedUser.lname,
                phone: editedUser.phone,
                email: editedUser.email,
                sex: editedUser.sex.value,
                authorities: authArr ? authArr : []
            }
            const response = await register(controllerRef.current.signal, dto);
            const user = {
                id: response.data.id,
                fname: editedUser.fname,
                lname: editedUser.lname,
                phone: editedUser.phone,
                email: editedUser.email,
                sex: editedUser.sex.value,
                status: 1,
                createdAt: new Date(),
            }
            setUsers([...users, user]);
            setTotalItemsCount(users.length - 1);
            setEditedUser(null);
            setNetworkRequest(false);
            handleCloseModal();
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const handleAuthUpdate = async (auths) => {
        try {
            setNetworkRequest(true);
            resetAbortController();

            const authArr = auths.map(auth => ( {id: auth.id, code: auth.code} ));

            await updateRoles(controllerRef.current.signal, {id: editedUser.id, authorities: authArr});
            
            setEditedUser(null);
            setNetworkRequest(false);
            handleCloseModal();
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const handleAddStaff = () => {
        setDisplayMsg('Add New Staff');
        setShowStaffCreationModal(true);
    }

	const handleCloseModal = () => {
        setShowConfirmModal(false);
        setShowStaffCreationModal(false);
        setShowStaffProfileModal(false);
    };
  
    const handleConfirm = async () => {
        setShowConfirmModal(false);
        switch (confirmDialogEvtName) {
            case "remove":
                delUser();
                break;
            case "restore":
                restoreUser();
                break;
            case "create":
                handleCreateStaff();
                break;
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
                    <Button variant="success fw-bold d-flex gap-3 align-items-center justify-content-center" className="w-100" onClick={handleAddStaff}>
                        <IoMdAddCircle size='32px' /> Add
                    </Button>
                </div>
            </Row>
            {/* NOTE: setting z-index of this row because of rsuite table which conflicts the drop down menu of react-select */}
            <Row className="card shadow border-0 rounded-3 z-3">
                <div className="card-body row ms-0 me-0">
                    <div className="d-flex gap-3 align-items-center col-12 col-md-4 mb-3">
                        <img src={IMAGES.staff_management} alt ="Avatar" className="rounded-circle" width={50} height={50} />
                        <span className="text-danger fw-bold h2">Staff Members</span>
                    </div>

                    <div className="d-flex flex-column gap-2 align-items-center col-12 col-md-4 mb-3">
                        <span className="align-self-start fw-bold">Search</span>
                        <AsyncSelect
                            className="text-dark w-100"
                            isClearable
                            // getOptionLabel={getOptionLabel}
                            getOptionValue={(option) => option}
                            // defaultValue={initialObject}
                            defaultOptions={userOptions}
                            cacheOptions
                            loadOptions={asyncUserSearch}
                            onChange={(val) => handleStaffChange(val) }
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

            <Table loading={networkRequest} rowKey="id" data={users} affixHeader affixHorizontalScrollbar 
                renderLoading={() => <RsuiteTableSkeletonLoader withPlaceholder={true} rows={10} cols={5} />} 
                autoHeight={true} hover={true}>
                    
                {columns.map((column, idx) => {
                    const { key, label, ...rest } = column;
                    return (
                        <Column {...rest} key={key} fullText>
                            <HeaderCell>{label}</HeaderCell>
                            <Cell dataKey={key} style={{ padding: 6 }} />
                        </Column>
                    );
                })}
                <Column width={150} >
                    <HeaderCell>Actions...</HeaderCell>
                    <ActionCell changeStatus={handleChangeStatus} onViewStaff={handleViewStaff} />
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
			<StaffCreationDialog
				show={showStaffCreationModal}
				handleClose={handleCloseModal}
				handleConfirm={handleConfirmStaffCreation}
				message={displayMsg}
                networkRequest={networkRequest}
                setNetworkREquest={setNetworkRequest}
                authOptions={authOptions}
			/>
			<StaffProfileViewDialog
				show={showStaffProfileModal}
				handleClose={handleCloseModal}
				handleConfirm={handleAuthUpdate}
				message={displayMsg}
                networkRequest={networkRequest}
                authOptions={authOptions}
                staff={editedUser}
			/>
        </section>
    )
}

export default Staff;