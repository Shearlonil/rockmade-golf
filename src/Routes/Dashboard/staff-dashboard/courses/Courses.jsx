import { useEffect, useRef, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { IoMdAddCircle } from "react-icons/io";
import { GrView } from "react-icons/gr";
import { VscEdit, VscSave, VscRemove } from 'react-icons/vsc';
import { TbRestore } from "react-icons/tb";
import { Table, IconButton, Input, NumberInput, DatePicker } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import IMAGES from "../../../../assets/images";
import { useAuthUser } from "../../../../app-context/user-context";
import useCourseController from "../../../../api-controllers/course-controller-hook";
import handleErrMsg from "../../../../Utils/error-handler";
import { statusOptions, pageSizeOptions } from "../../../../Utils/data";
import PaginationLite from '../../../../Components/PaginationLite';
import RsuiteTableSkeletonLoader from "../../../../Components/RsuiteTableSkeletonLoader";
import ConfirmDialog from "../../../../Components/DialogBoxes/ConfirmDialog";
import cryptoHelper from "../../../../Utils/crypto-helper";

const columns = [
    {
        key: 'name',
        label: 'Name',
        fixed: true,
        flexGrow: 2,
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

const ActionCell = ({ rowData, dataKey, onEdit, changeStatus, onSave, onViewCourse, ...props }) => {
    return (
        <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px', width: '400px' }}>
            <IconButton icon={<GrView color='green' />} onClick={() => { onViewCourse(rowData.id); }}  />
            <IconButton appearance="subtle" icon={rowData.mode === 'EDIT' ? <VscSave /> : <VscEdit />} onClick={() => { onEdit(rowData.id); }}/>
            <IconButton appearance="subtle" icon={rowData.status == true ? <VscRemove /> : <TbRestore />} onClick={() => { changeStatus(rowData); }}  />
            <IconButton icon={<VscSave color='green' />} onClick={() => { onSave(rowData); }}  />
        </Cell>
  );
};

const Courses = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { paginateFetch, courseSearch, activeCoursesPageInit, status, updateCourse } = useCourseController();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
    const [courseOptions, setCourseOptions] = useState([]);
    const [courseStatus, setCourseStatus] = useState(true);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");
    const [confirmDialogEvtName, setConfirmDialogEvtName] = useState(null);
    const [editedCourse, setEditedCourse] = useState(null);
        
    //	for pagination
    const [pageSize, setPageSize] = useState(pageSizeOptions[2].value);
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    
    //  data returned from DataPagination
    const [courses, setCourses] = useState([]);
    
    useEffect(() => {
        if(!user || cryptoHelper.decryptData(user.mode) !== '0'){
            navigate("/");
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
            const response = await activeCoursesPageInit(controllerRef.current.signal, pageSize);

            //	check if the request to fetch pkg doesn't fail before setting values to display
            if(response && response.data){
                const { count, results } = response.data;
                setCourseOptions(results?.map(course => ({label: course.name, value: course})));
                if(results && count){
                    setCourses(results);
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

    const asyncCourseSearch = async (inputValue, callback) => {
        /*  refs: https://stackoverflow.com/questions/65963103/how-can-i-setup-react-select-to-work-correctly-with-server-side-data-by-using  */
        try {
            setNetworkRequest(true);
            resetAbortController();
            const response = await courseSearch(controllerRef.current.signal, {inputValue, courseStatus});
            const results = response.data.map(course => ({label: course.name, value: course}));
            setCourseOptions(results);
            setCourses(response.data);
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

    const handleCourseChange = (val) => {
        setTotalItemsCount(0);
        setCourses( val ? [val.value] : [] );
    };

    const handleStatusChange = async (val) => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            const response = await paginateFetch(controllerRef.current.signal, {page: 1, pageSize, courseStatus: val.value});
            const { count, results } = response.data;
            setCourseOptions(results.map(course => ({label: course.name, value: course})));
            setCourses(results);
            setCurrentPage(1);
            setTotalItemsCount(count);
            setCourseStatus(val.value);
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
            const response = await paginateFetch(controllerRef.current.signal, {page: 1, pageSize: val.value, courseStatus});
            const { count, results } = response.data;
            setCourseOptions(results.map(course => ({label: course.name, value: course})));
            setCourses(results);
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
            const response = await paginateFetch(controllerRef.current.signal, {page: pageNumber, pageSize, courseStatus});
            const { count, results } = response.data;
            setCourseOptions(results.map(course => ({label: course.name, value: course})));
            setCourses(results);
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

	const delGolfCourse = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            await status(controllerRef.current.signal, {id: editedCourse.id, status: false});
            setCourses(courses.filter(course => editedCourse.id !== course.id));
            setTotalItemsCount(courses.length - 1);
            setEditedCourse(null);
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

	const restoreGolfCourse = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            await status(controllerRef.current.signal, {id: editedCourse.id, status: true});
            setCourses(courses.filter(course => editedCourse.id !== course.id));
            setTotalItemsCount(courses.length - 1);
            setEditedCourse(null);
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

    const updateGolfCourse = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            await updateCourse(controllerRef.current.signal, {id: editedCourse.id, name: editedCourse.name, location: editedCourse.location});
            setEditedCourse(null);
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
        const nextData = Object.assign([], courses);
        nextData.find(item => item.id === id)[key] = value;
        setCourses(nextData);
    };

    const handleEdit = id => {
        const nextData = Object.assign([], courses);
        const activeItem = nextData.find(item => item.id === id);

        activeItem.mode = activeItem.mode ? null : 'EDIT';

        setCourses(nextData);
    };

    const handleChangeStatus = course => {
        if(course.status){
            setConfirmDialogEvtName('remove');
            setDisplayMsg(`Delete ${course.name} from active list?`);
            setShowConfirmModal(true);
            setEditedCourse(course);
        }else {
            setConfirmDialogEvtName('restore');
            setDisplayMsg(`Restore ${course.name} from list of inactive courses?`);
            setShowConfirmModal(true);
            setEditedCourse(course);
        }
    };
  
    const handleSave = async (course) => {
        setConfirmDialogEvtName('save');
        setDisplayMsg(`Save changes made to ${course.name}?`);
        setShowConfirmModal(true);
        setEditedCourse(course);
    };
  
    const handleCourseView = id => {
        navigate(`/dashboard/staff/courses/${id}/view`)
    };

	const handleCloseModal = () => {
        setShowConfirmModal(false);
    };
  
    const handleConfirm = async () => {
        setShowConfirmModal(false);
        switch (confirmDialogEvtName) {
            case "remove":
                delGolfCourse();
                break;
            case "restore":
                restoreGolfCourse();
                break;
            case 'save':
                updateGolfCourse();
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
                    <Button variant="success fw-bold d-flex gap-3 align-items-center justify-content-center" className="w-100" onClick={() => navigate('/dashboard/staff/courses/create')}>
                        <IoMdAddCircle size='32px' /> Add
                    </Button>
                </div>
            </Row>
            {/* NOTE: setting z-index of this row because of rsuite table which conflicts the drop down menu of react-select */}
            <Row className="card shadow border-0 rounded-3 z-3">
                <div className="card-body row ms-0 me-0">
                    <div className="d-flex gap-3 align-items-center col-12 col-md-4 mb-3">
                        <img src={IMAGES.golf_course} alt ="Avatar" className="rounded-circle" width={50} height={50} />
                        <span className="text-danger fw-bold h2">Golf Courses</span>
                    </div>

                    <div className="d-flex flex-column gap-2 align-items-center col-12 col-md-4 mb-3">
                        <span className="align-self-start fw-bold">Search</span>
                        <AsyncSelect
                            className="text-dark w-100"
                            isClearable
                            // getOptionLabel={getOptionLabel}
                            getOptionValue={(option) => option}
                            // defaultValue={initialObject}
                            defaultOptions={courseOptions}
                            cacheOptions
                            loadOptions={asyncCourseSearch}
                            onChange={(val) => handleCourseChange(val) }
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

            <Table loading={networkRequest} rowKey="id" data={courses} affixHeader affixHorizontalScrollbar 
                renderLoading={() => <RsuiteTableSkeletonLoader withPlaceholder={true} rows={10} cols={5} />} 
                autoHeight={true} hover={true}>
                    
                {columns.map((column, idx) => {
                    const { key, label, ...rest } = column;
                    if(idx < 2){
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
                    <ActionCell onEdit={handleEdit} changeStatus={handleChangeStatus} onSave={handleSave} onViewCourse={handleCourseView} />
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
        </section>
    )
}

export default Courses;