import { useEffect, useRef, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

import { useAuthUser } from '../../../app-context/user-context';
import IMAGES from '../../../assets/images';
import handleErrMsg from '../../../Utils/error-handler';
import OffcanvasMenu from '../../../Components/OffcanvasMenu';
import cryptoHelper from '../../../Utils/crypto-helper';
import StaffCreationDialog from '../../../Components/DialogBoxes/StaffCreationDialog';
import ConfirmDialog from '../../../Components/DialogBoxes/ConfirmDialog';
import useStaffController from '../../../api-controllers/staff-controller';

const StaffDashboard = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const { register } = useStaffController();
    const { dashboard } = useStaffController();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
    const [showStaffCreationModal, setShowStaffCreationModal] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");
    const [confirmDialogEvtName, setConfirmDialogEvtName] = useState(null);
    const [newUser, setNewUser] = useState(null);
    
    const [topPlayedCoursesData, setTopPlayedCoursesData] = useState([ { name: "Fetching Data", value: 1, color: "#0088FE" } ]);
    const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
    const [totalContests, setTotalContests] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [subscribedUsers, setSubscribedUsers] = useState(0);
    const [activeGolfCourses, setActiveGolfCourses] = useState(0);
    
    const usersOffCanvasMenu = [
        { label: "Golf Courses", onClickParams: {evtName: 'viewGolfCourses'} },
        { label: "Contests", onClickParams: {evtName: 'contests'} },
        { label: "Users", onClickParams: {evtName: 'users'} },
    ];
    
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8a2be2"];
    const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        
        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    useEffect(() => {
        if(!user || cryptoHelper.decryptData(user.mode) === '1'){
            navigate("/");
        }
        setMonthlyRevenueData([{month: months[0], amount: 1000}]);

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
            const response = await dashboard(controllerRef.current.signal);
            setTotalUsers(response.data.total_users.total_users);
            setActiveGolfCourses(response.data.active_courses.total_courses);
            setSubscribedUsers(response.data.sub_users.sub_users);
            setTotalContests(response.data.total_contests);
            const arr = [];
            response.data.top_courses.forEach((top_course, idx) =>  {
                const obj = {
                    name : top_course.name,
                    value : top_course.occurence,
                    color: COLORS[idx],
                }
                arr.push(obj);
            });
            setTopPlayedCoursesData(arr);
            if(response && response.data && response.data.top_courses.length <= 0){
                setTopPlayedCoursesData([
                    {
                        name: "No Data",
                        value: 1,
                        color: COLORS[4]
                    }
                ]);
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
    }

    const handleAddStaff = () => {
        setDisplayMsg('Add New Staff');
        setShowStaffCreationModal(true);
    }

	const handleOffCanvasMenuItemClick = async (menus, e) => {
		switch (menus.onClickParams.evtName) {
            case 'viewGolfCourses':
                navigate('/dashboard/staff/courses');
                break;
            case 'contests':
                navigate('/dashboard/contests');
                break;
            case 'users':
                navigate('/dashboard/users');
                break;
            case 'pw':
                navigate('/dashboard/users');
                break;
        }
	}
  
    const handleCreateStaff = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            const authArr = newUser.authorities?.map(auth => auth.value.code);
            const dto = {
                fname: newUser.fname,
                lname: newUser.lname,
                phone: newUser.phone,
                email: newUser.email,
                sex: newUser.sex.value,
                authorities: authArr ? authArr : []
            }
            const response = await register(controllerRef.current.signal, dto);
            const user = {
                id: response.data.id,
                fname: newUser.fname,
                lname: newUser.lname,
                phone: newUser.phone,
                email: newUser.email,
                sex: newUser.sex.value,
                status: 1,
                createdAt: new Date(),
            }
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

    const handleConfirmStaffCreation = staff => {
        setNewUser(staff);
        setDisplayMsg('Create new account?');
        setConfirmDialogEvtName('create');
        setShowConfirmModal(true);
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

	const handleCloseModal = () => {
        setShowConfirmModal(false);
        setShowStaffCreationModal(false);
    };

    const resetAbortController = () => {
        // Cancel previous request if it exists
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
    };

    return (
        <section className='container' style={{minHeight: '60vh'}}>
            <OffcanvasMenu menuItems={usersOffCanvasMenu} menuItemClick={handleOffCanvasMenuItemClick} variant='danger' />
            <Row className='mt-4'>
                <div className="d-flex flex-wrap gap-4 align-items-center col-md-8 col-sm-12" >
                    <img src={IMAGES.image1} alt ="Avatar" className="rounded-circle" width={100} height={100} />
                    <div className="d-flex flex-wrap gap-2 fw-bold h2">
                        <span>{user.firstName}</span>
                        <span> {user.lastName}</span>
                    </div>
                </div>
            </Row>
            <Row className='mt-4'>
                <Col xs={12} md={3} sm={12} className="mb-2">
                    <div className="p-2 h-100">
                        <div className="card shadow border-0 rounded-3 h-100" style={{minHeight: 170}}>
                            {!networkRequest && <div className="card-body">
                                <div className='d-flex justify-content-between'>
                                    <span className='h1 text-warning fw-bold' style={{fontSize: '50px'}}>{totalUsers}</span>
                                </div>
                                <span>All Registered Users</span>
                            </div>}
                            {networkRequest && <div className="card-body">
                                <div className='d-flex flex-column justify-content-between'>
                                    <Skeleton count={4} style={{width: '100%'}} />
                                </div>
                                <Skeleton count={2} style={{width: '100%'}} />
                            </div>}
                            <div className="card-footer fw-bold bg-warning">
                                Total Users
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={3} sm={12} className="mb-2">
                    <div className="p-2 h-100">
                        <div className="card shadow border-0 rounded-3 h-100">
                            {!networkRequest && <div className="card-body">
                                <div className='d-flex justify-content-between'>
                                    <span className='h1 text-danger fw-bold' style={{fontSize: '50px'}}>{subscribedUsers}</span>
                                </div>
                                <span>Number Subscribed Users</span>
                            </div>}
                            {networkRequest && <div className="card-body">
                                <div className='d-flex flex-column justify-content-between'>
                                    <Skeleton count={4} style={{width: '100%'}} />
                                </div>
                                <Skeleton count={2} style={{width: '100%'}} />
                            </div>}
                            <div className="card-footer text-white bg-danger">
                                Subscribed Users
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={3} sm={12} className="mb-2">
                    <div className="p-2 h-100">
                        <div className="card shadow border-0 rounded-3 h-100">
                            {!networkRequest && <div className="card-body">
                                <div className='d-flex justify-content-between'>
                                    <span className='h1 text-primary fw-bold' style={{fontSize: '50px'}}>{activeGolfCourses}</span>
                                </div>
                                <span>Number of active golf courses</span>
                            </div>}
                            {networkRequest && <div className="card-body">
                                <div className='d-flex flex-column justify-content-between'>
                                    <Skeleton count={4} style={{width: '100%'}} />
                                </div>
                                <Skeleton count={2} style={{width: '100%'}} />
                            </div>}
                            <div className="card-footer text-white bg-primary">
                                Total Golf Courses
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={3} sm={12} className="mb-2">
                    <div className="p-2 h-100">
                        <div className="card shadow border-0 rounded-3 h-100">
                            {!networkRequest && <div className="card-body">
                                <div className='d-flex justify-content-between'>
                                    <span className='h1 text-success fw-bold' style={{fontSize: '50px'}}>{totalContests}</span>
                                </div>
                                <span>Total available contests</span>
                            </div>}
                            {networkRequest && <div className="card-body">
                                <div className='d-flex flex-column justify-content-between'>
                                    <Skeleton count={4} style={{width: '100%'}} />
                                </div>
                                <Skeleton count={2} style={{width: '100%'}} />
                            </div>}
                            <div className="card-footer text-white bg-success">
                                Total Contests
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <div className="row mt-3">
                <Col xs={12} md={6} sm={12} className="mb-2 col-12 d-flex flex-column justify-content-center">
                    <div className="card shadow border-0 rounded-3 h-100 p-4">
                        <div className="card-body">
                            <h2 className="fw-bold space-mono-bold">Monthly Revenue</h2>
                            <div className="d-flex justify-content-center flex-wrap gap-3">
                                <ResponsiveContainer aspect={1.99} height={400}>
                                    <BarChart
                                        width={'100%'}
                                        data={monthlyRevenueData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend width={'100%'} />
                                        <Bar dataKey="amount" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={6} sm={12} className="mb-2">
                    <div className="card shadow border-0 rounded-3 h-100 p-4">
                        <div className="card-body d-flex flex-column gap-3">
                            <h2 className="fw-bold space-mono-bold">TOP 5 MOST PLAYED COURSES</h2>
                            <div className="d-flex justify-content-center">
                                <PieChart width={320} height={320}>
                                    <Pie
                                        data={topPlayedCoursesData}
                                        cx={150}
                                        cy={150}
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={150}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {topPlayedCoursesData.map((entry, index) => ( <Cell key={`cell-${index}`} fill={entry.color} /> ))}
                                    </Pie>
                                </PieChart>
                            </div>
                            <div className="d-flex align-items-start flex-wrap gap-3">
                                {topPlayedCoursesData.map((entry, index) => (
                                    <div className="d-flex gap-3" key={`cell-${index}`}>
                                        {/* https://stackoverflow.com/questions/49070926/i-want-to-create-a-small-square-colour-filled-box-in-html-css-and-most-import */}
                                        <div style={{height: '20px', width: '20px', backgroundColor: `${entry.color}`}}></div>
                                        <span>{`${entry.name}`}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Col>
            </div>
            <div className="row mt-3 mb-5">
                <div className="col-12 col-sm-3">
                    <div className="p-2">
                        <Button variant='warning' className='w-100 fw-bold' onClick={handleAddStaff}>Add Users</Button> 
                    </div>
                </div>
                <div className="col-12 col-sm-3"> 
                    <div className="p-2">
                        <Button variant='danger' className='w-100 fw-bold' onClick={() => navigate('staff/courses/create')}>Add Golf Course</Button> 
                    </div>
                </div>
                <div className="col-12 col-sm-3"> 
                    <div className="p-2">
                        <Button variant='primary' className='w-100 fw-bold' onClick={() => navigate('contests')}>View Contests</Button>
                    </div>
                </div>
                <div className="col-12 col-sm-3"> 
                    <div className="p-2">
                        <Button variant='success' className='w-100 fw-bold' onClick={() => navigate("profile")}>My Profile</Button> 
                    </div>
                </div>
            </div>
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
			/>
        </section>
    )
}

export default StaffDashboard;