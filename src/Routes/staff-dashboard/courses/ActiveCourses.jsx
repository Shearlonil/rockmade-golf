import { useEffect, useRef, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { IoMdAddCircle } from "react-icons/io";
import { GrView } from "react-icons/gr";
import { VscEdit, VscSave, VscRemove } from 'react-icons/vsc';
import { Table, IconButton, Input, NumberInput, DatePicker } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import IMAGES from "../../../assets/images";
import { useAuthUser } from "../../../app-context/user-context";
import useCourseController from "../../../api-controllers/course-controller-hook";
import useGenericController from '../../../api-controllers/generic-controller-hook';
import handleErrMsg from "../../../Utils/error-handler";
import { status } from "../../../Utils/data";
import PaginationLite from '../../../Components/PaginationLite';
import RsuiteTableSkeletonLoader from "../../../Components/RsuiteTableSkeletonLoader";

const styles = `
.table-cell-editing .rs-table-cell-content {
  padding: 4px;
}
.table-cell-editing .rs-input {
  width: 100%;
}
`;

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
    const editing = rowData.status === 'EDIT';

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

const ActionCell = ({ rowData, dataKey, onEdit, onRemove, onSave, onViewCouse, ...props }) => {
    return (
        <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px', width: '400px' }}>
            <IconButton icon={<GrView color='green' />} onClick={() => { onViewCouse(rowData.id); }}  />
            <IconButton appearance="subtle" icon={rowData.status === 'EDIT' ? <VscSave /> : <VscEdit />} onClick={() => { onEdit(rowData.id); }}/>
            <IconButton appearance="subtle" icon={<VscRemove />} onClick={() => { onRemove(rowData.id); }}  />
            <IconButton icon={<VscSave color='green' />} onClick={() => { onSave(rowData.id); }}  />
        </Cell>
  );
};

const ActiveCourses = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { fetchAllActive } = useCourseController();
    const { performGetRequests } = useGenericController();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
    const [courseOptions, setCourseOptions] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(true);
        
    //	for pagination
    const [pageSize] = useState(10);
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    
    //  data returned from DataPagination
    const [pagedData, setPagedData] = useState([]);
    const [courses, setCourses] = useState([]);
    
    useEffect(() => {
        if(!user || !user.authorities || user.authorities.length === 0){
            navigate("/");
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
            const urls = ['/courses/active/init', '/courses/inactive/init'];
            const response = await performGetRequests(urls, controllerRef.current.signal);
            const { 0: activeCoursesReq, 1: inactiveCoursesReq } = response;

            //	check if the request to fetch pkg doesn't fail before setting values to display
            if(activeCoursesReq){
                const { count, results } = activeCoursesReq.data;
                setCourseOptions(results.map(course => ({label: course.name, value: course})));
                setCourses(results);
            }

            //	check if the request to fetch vendors doesn't fail before setting values to display
            if(inactiveCoursesReq){
            }

            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            // setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const asyncCourseSearch = async () => {
    };

    const courseChange = (val) => {};

    const setPageChanged = async (pageNumber) => {
		setCurrentPage(pageNumber);
    	const startIndex = (pageNumber - 1) * pageSize;
      	setPagedData(courses.slice(startIndex, startIndex + pageSize));
    };

    const handleChange = (id, key, value) => {
        const nextData = Object.assign([], courses);
        nextData.find(item => item.id === id)[key] = value;
        setCourses(nextData);
    };

    const handleEdit = id => {
        const nextData = Object.assign([], courses);
        const activeItem = nextData.find(item => item.id === id);

        activeItem.status = activeItem.status ? null : 'EDIT';

        setCourses(nextData);
    };

    const handleRemove = id => {
        setCourses(courses.filter(item => item.id !== id));
    };
  
    const handleSave = id => {};
  
    const handleCourseView = id => {
        navigate(`/dashboard/staff/courses/${id}/view`)
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

                    <div className="d-flex gap-3 align-items-center col-12 col-md-4 mb-3">
                        <AsyncSelect
                            className="text-dark w-100"
                            isClearable
                            // getOptionLabel={getOptionLabel}
                            getOptionValue={(option) => option}
                            // defaultValue={initialObject}
                            defaultOptions={courseOptions}
                            cacheOptions
                            loadOptions={asyncCourseSearch}
                            onChange={(val) => courseChange(val) }
                        />
                    </div>

                    <div className="d-flex align-items-center justify-content-end col-12 col-md-4 mb-3">
                        <Select
                            required
                            name="filter"
                            placeholder="Filter..."
                            className="text-dark w-100"
                            defaultValue={status[0]}
                            options={status}
                            onChange={(val) => { courseChange(val) }}
                        />
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
                    <ActionCell onEdit={handleEdit} onRemove={handleRemove} onSave={handleSave} onViewCouse={handleCourseView} />
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
        </section>
    )
}

export default ActiveCourses;