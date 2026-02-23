import { useEffect, useRef, useState } from "react";
import { Button, FloatingLabel, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdCancel } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { GrView } from "react-icons/gr";
import { Table, IconButton, Input, InputGroup } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import { useAuthUser } from "../../../../app-context/user-context";
import handleErrMsg from "../../../../Utils/error-handler";
import RsuiteTableSkeletonLoader from "../../../../Components/RsuiteTableSkeletonLoader";
import IMAGES from "../../../../assets/images";
import cryptoHelper from "../../../../Utils/crypto-helper";

const columns = [
    {
        key: 'name',
        label: 'Name',
        fixed: true,
        width: 200
    },
    {
        key: 'mode',
        label: 'Game',
        flexGrow: 1,
    },
    {
        key: 'hole_mode',
        label: 'Hole Mode',
        flexGrow: 1,
    },
    {
        key: 'date',
        label: 'Game Date',
        flexGrow: 1,
    },
    {
        key: 'players',
        label: 'Players',
        flexGrow: 1,
    },
];

const ActionCell = ({ rowData, dataKey, onEdit, changeStatus, onSave, onViewCourse, ...props }) => {
    return (
        <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px', width: '400px' }}>
            <IconButton icon={<GrView color='green' />} onClick={() => { onViewCourse(rowData.id); }}  />
        </Cell>
  );
};

const RecentGames = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { authUser } = useAuthUser();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    
    //  data returned from DataPagination
    const [courses, setCourses] = useState([]);
    
    useEffect(() => {
        if(!user || cryptoHelper.decryptData(user.mode) !== '1'){
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
            // const response = await courseSearch(controllerRef.current.signal, {inputValue, courseStatus});
            let response = {data: []}
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

	const handleKeyDown = async (event) => {
		if (event.key === 'Enter') {
			const searchString = event.target.value;
			console.log(searchString, searchKeyword);
			// await performCustomSearch(temp);
		}
	}

    const handleCourseChange = (val) => {
    };
  
    const handleCourseView = id => {
        navigate(`/dashboard/staff/courses/${id}/view`)
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
            {/* NOTE: setting z-index of this row because of rsuite table which conflicts the drop down menu of react-select */}
            <Row className="card shadow border-0 rounded-3 z-3 mt-5">
                <div className="card-body row ms-0 me-0">
                    <div className="d-flex gap-3 align-items-center col-12 col-md-4 mb-3">
                        <img src={IMAGES.golf_course} alt ="Avatar" className="rounded-circle" width={50} height={50} />
                        <span className="text-danger fw-bold h2">Recent Games</span>
                    </div>

                    <div className="d-flex flex-column gap-2 justify-content-center col-12 col-md-4 mb-3">
                        {/* <FloatingLabel
                            controlId="floatingInput1"
                            label="Search"
                            className="w-100 mt-2"
                        >
                            <Form.Control
                                className="border border-dark"
                                type="text"
                                placeholder="Search"
                                onKeyDown={handleKeyDown}
                            />
                            
                        </FloatingLabel> */}
                        <InputGroup inside w={300} className="border border-dark">
                                <Input value={searchKeyword} onChange={setSearchKeyword} onKeyDown={handleKeyDown} />
                                {searchKeyword ? (
                                    <InputGroup.Button onClick={() => setSearchKeyword('')}>
                                        <MdCancel color="red" />
                                    </InputGroup.Button>
                                ) : (
                                    <InputGroup.Addon>
                                        <IoIosSearch />
                                    </InputGroup.Addon>
                                )}
                            </InputGroup>
                    </div>
                </div>
            </Row>

            <Table loading={networkRequest} rowKey="id" data={courses} affixHeader affixHorizontalScrollbar autoHeight={true} hover={true}
                renderLoading={() => <RsuiteTableSkeletonLoader withPlaceholder={true} rows={10} cols={5} />} >
                    
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
                    <ActionCell onViewCourse={handleCourseView} />
                </Column>
            </Table>
        </section>
    )
}

export default RecentGames;