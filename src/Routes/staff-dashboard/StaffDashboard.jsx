import { useEffect, useRef, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuthUser } from '../../app-context/user-context';
import { useProfileImg } from '../../app-context/dp-context';
import IMAGES from '../../assets/images';
import handleErrMsg from '../../Utils/error-handler';

const StaffDashboard = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { imageBlob, setImageBlob } =  useProfileImg();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
    const [topPlayedCoursesData, setTopPlayedCoursesData] = useState([ { name: "Fetching Data", value: 1, color: "#0088FE" } ]);
    const [mostPlayedContestsData, setMostPlayedContestsData] = useState([]);
    
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
        if(!user || !user.authorities || user.authorities.length === 0){
            navigate("/");
        }
        setMostPlayedContestsData([{month: months[0], amount: 1000}]);

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
            if (error.name === 'AbortError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    }

    return (
        <section className='container' style={{minHeight: '60vh'}}>
            <Row className='mt-4'>
                <div className="d-flex flex-wrap gap-4 align-items-center" >
                    <img src={IMAGES.image1} alt ="Avatar" className="rounded-circle" width={100} height={100} />
                    <div className="d-flex flex-wrap gap-2 fw-bold h2">
                        <span>{user.firstName}</span>
                        <span> {user.lastName}</span>
                    </div>
                </div>
            </Row>
            <Row className='mt-4'>
                <Col xs={12} md={3} sm={12} className="mb-2">
                    <div className="p-2">
                        <div className="card shadow border-0 rounded-3 h-100" style={{minHeight: 170}}>
                            <div className="card-body">
                                This is some text within a card body.
                            </div>
                            <div className="card-footer fw-bold bg-warning">
                                Total Users
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={3} sm={12} className="mb-2">
                    <div className="p-2 h-100">
                        <div className="card shadow border-0 rounded-3 h-100">
                            <div className="card-body">
                                This is some text within a card body.
                            </div>
                            <div className="card-footer text-white bg-danger">
                                Subscribed Users
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={3} sm={12} className="mb-2">
                    <div className="p-2 h-100">
                        <div className="card shadow border-0 rounded-3 h-100">
                            <div className="card-body">
                                This is some text within a card body.
                            </div>
                            <div className="card-footer text-white bg-primary">
                                Total Golf Courses
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={3} sm={12} className="mb-2">
                    <div className="p-2 h-100">
                        <div className="card shadow border-0 rounded-3 h-100">
                            <div className="card-body">
                                This is some text within a card body.
                            </div>
                            <div className="card-footer text-white bg-success">
                                Total Contests
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <div className="row mt-3">
                <Col xs={12} md={6} sm={12} className="mb-2 col-12 col-sm-8 my-2 d-flex flex-column justify-content-center">
                    <div className="card shadow border-0 rounded-3 h-100 p-4">
                        <div className="card-body">
                            <h2 className="fw-bold space-mono-bold">Monthly Revenue</h2>
                            <div className="d-flex justify-content-center flex-wrap gap-3">
                                <ResponsiveContainer aspect={1.99} height={400}>
                                    <BarChart
                                        width={'100%'}
                                        data={mostPlayedContestsData}
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
                            </div>
                        </div>
                    </div>
                </Col>
            </div>
            <div className="row mt-3 mb-5">
                <div className="col-12 col-sm-3">
                    <div className="p-2">
                        <Button variant='warning' className='w-100 fw-bold'>Add Users</Button> 
                    </div>
                </div>
                <div className="col-12 col-sm-3"> 
                    <div className="p-2">
                        <Button variant='danger' className='w-100 fw-bold' onClick={() => navigate('staff/course/create')}>Add Golf Course</Button> 
                    </div>
                </div>
                <div className="col-12 col-sm-3"> 
                    <div className="p-2">
                        <Button variant='primary' className='w-100 fw-bold'>View Contests</Button> 
                    </div>
                </div>
                <div className="col-12 col-sm-3"> 
                    <div className="p-2">
                        <Button variant='success' className='w-100 fw-bold'>My Profile</Button> 
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StaffDashboard;