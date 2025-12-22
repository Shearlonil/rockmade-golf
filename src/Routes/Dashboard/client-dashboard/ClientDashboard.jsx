import { useEffect, useRef, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import { IoSettings } from "react-icons/io5";
import { GrView } from "react-icons/gr";
import { VscRemove } from 'react-icons/vsc';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isAfter } from 'date-fns';
import { Table, IconButton } from 'rsuite';
const { Column, HeaderCell } = Table;

import { useAuthUser } from '../../../app-context/user-context';
import IMAGES from '../../../assets/images';
import handleErrMsg from '../../../Utils/error-handler';
import cryptoHelper from '../../../Utils/crypto-helper';
import { useAuth } from '../../../app-context/auth-context';
import useUserController from '../../../api-controllers/user-controller-hook';
import useGenericController from '../../../api-controllers/generic-controller-hook';
import { OrbitalLoading } from '../../../Components/react-loading-indicators/Indicator';
import ConfirmDialog from '../../../Components/DialogBoxes/ConfirmDialog';
import useGameController from '../../../api-controllers/game-controller-hook';
import ImageComponent from '../../../Components/ImageComponent';
import { useActiveCourses } from '../../../app-context/active-courses-context';

const columns = [
    {
        key: 'name',
        label: 'Name',
        fixed: true,
        flexGrow: 2,
        // width: 200
    },
    {
        key: 'course_name',
        label: 'Course',
        flexGrow: 2,
        // fixed: true,
        // width: 200
    },
    {
        key: 'hole_mode',
        label: 'Hole Mode',
        flexGrow: 1,
        // fixed: true,
        // width: 200
    },
    {
        key: 'date',
        label: 'Game Date',
        flexGrow: 1,
        // width: 100
    },
    {
        key: 'status',
        label: 'Game Status',
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

const ActionCell = ({ rowData, dataKey, onDelete, onViewGame, ...props }) => {
    return (
        <Table.Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px', width: '400px' }}>
            <IconButton icon={<GrView color='green' />} onClick={() => { onViewGame(rowData); }}  />
            <IconButton appearance="subtle" icon={<VscRemove />} onClick={() => { onDelete(rowData); }}  />
        </Table.Cell>
  );
};

const ClientDashboard = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { logout } = useAuth();
    const { setUserHomeClub } =  useActiveCourses();
    const { performGetRequests, download } = useGenericController();
    const { removeOngoingGame } = useGameController();
    const { dashbaord } = useUserController();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
    const [topPlayedCoursesData, setTopPlayedCoursesData] = useState([ { name: "Fetching Data", value: 1, color: "#0088FE" } ]);
    const [mostPlayedContestsData, setMostPlayedContestsData] = useState([]);

    const [roundToDel, setRoundToDel] = useState(null);
    const [coursesPlayed, setCoursesPlayed] = useState(0);
    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [homeClub, setHomeClub] = useState("");
    const [ongoigRounds, setOngongRounds] = useState([]);
    const [recentGames, setRecentGames] = useState([]);

	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");
    const [confirmDialogEvtName, setConfirmDialogEvtName] = useState(null);
    
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
        if(!user || cryptoHelper.decryptData(user.mode) !== '1'){
            logoutUnauthorized();
        }
        setMostPlayedContestsData([{month: months[0], amount: 1000}]);

        initialize();
        return () => {
            // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
            controllerRef.current.abort();
        };
    }, [location.pathname]);

    const logoutUnauthorized = async () => {
        setNetworkRequest(true);
        await logout();
        navigate("/");
    }

    const initialize = async () => {
        try {
            controllerRef.current = new AbortController();
            setNetworkRequest(true);
            const response = await dashbaord(controllerRef.current.signal);
            if(response && response.data){
                setCoursesPlayed(response.data.courses_played);
                setGamesPlayed(response.data.games_played);
                setHomeClub(response.data.home_club);
                setUserHomeClub(response.data.home_club);
                const rounds = response.data.ongoing_rounds.map(r => {
                    let mode = 'Full 18';
                    if(r.hole_mode === 2){
                        mode = 'Font 9'
                    }else if(r.hole_mode === 3) {
                        mode = 'Back 9'
                    }
                    return {
                        id: r.game_id,
                        name: r.name,
                        course_name: r.course_name,
                        date: r.date,
                        status: r.status === 1 ? "Yet to play" : "In play",
                        hole_mode: mode,
                        createdAt: r.createdAt
                    }
                });
                setOngongRounds(rounds);
            }
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

    const handleOngoingGameDelete = (data) => {
        setRoundToDel(data);
        setConfirmDialogEvtName('removeOngoing');
        setDisplayMsg(`Delete ongoing round ${data.name}?. Action cannot be undone!`);
        setShowConfirmModal(true);
    }

    const handleViewOngoingGame = (data) => {
        const nameArr = data.name.split(' ');
        const strName = nameArr.join('+');
        navigate(`/dashboard/client/${data.id}/game/${strName}`);
    }

    const createGame = () => {
        if(user && user.sub && isAfter(new Date(), new Date(cryptoHelper.decryptData(user.sub)).setHours(23, 59, 59, 0))){
            // navigate to sub page
            navigate('/memberships');
            return;
        }
        navigate('game/create');
    }

	const handleCloseModal = () => {
        setShowConfirmModal(false);
    };
  
    const handleConfirm = async () => {
        setShowConfirmModal(false);
        switch (confirmDialogEvtName) {
            case "removeOngoing":
                delOngoingGame();
                break;
        }
    };

	const delOngoingGame = async () => {
        try {
            resetAbortController();
            setNetworkRequest(true);
            await removeOngoingGame(controllerRef.current.signal, roundToDel.id);
            // remove game from table data
            const temp = [...ongoigRounds];
            const idx = temp.findIndex(o => o.id === roundToDel.id);
            temp.splice(idx, 1);
            setOngongRounds(temp);
            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError') {
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
        <section className='container' style={{minHeight: '60vh'}}>
            <Row className='mt-4'>
                <div className="d-flex flex-wrap gap-4 align-items-center justify-content-center col-md-6 col-sm-12" >
                    {user.blur && <ImageComponent image={user.blur} width={'100px'} height={'100px'} round={true} />}
                    {!user.blur && <img src={IMAGES.member_icon} alt ="Avatar" className="rounded-circle" width={100} height={100} />}
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
                                <div className='d-flex flex-column justify-content-between'>
                                    <span className='align-self-end'>
                                        <IoSettings size={30} className='text-warning' onClick={() => null} />
                                    </span>
                                    <span className='h1 text-warning fw-bold' style={{fontSize: '50px'}}>{user?.hcp}</span>
                                </div>
                                <span>Handicap Index value</span>
                            </div>
                            <div className="card-footer fw-bold bg-warning">
                                HCP
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={3} sm={12} className="mb-2">
                    <div className="p-2 h-100">
                        <div className="card shadow border-0 rounded-3 h-100">
                            <div className="card-body">
                                <div className='d-flex justify-content-between'>
                                    <span className='h1 text-danger fw-bold' style={{fontSize: '50px'}}>{coursesPlayed}</span>
                                </div>
                                <span>Number of courses played</span>
                            </div>
                            <div className="card-footer text-white bg-danger">
                                Courses Played
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={3} sm={12} className="mb-2">
                    <div className="p-2 h-100">
                        <div className="card shadow border-0 rounded-3 h-100">
                            <div className="card-body">
                                <div className='d-flex justify-content-between'>
                                    <span className='h1 text-primary fw-bold' style={{fontSize: '50px'}}>{gamesPlayed}</span>
                                </div>
                                <span>Number of games played</span>
                            </div>
                            <div className="card-footer text-white bg-primary">
                                Total Games Played
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={3} sm={12} className="mb-2">
                    <div className="p-2 h-100">
                        <div className="card shadow border-0 rounded-3 h-100">
                            <div className="card-body">
                                <div className='d-flex flex-column justify-content-between'>
                                    <span className='align-self-end'>
                                        <IoSettings size={30} style={{ color: 'green' }} onClick={() => null} />
                                    </span>
                                    <span className='text-success fw-bold' style={{fontSize: '25px'}}>{homeClub?.name}</span>
                                </div>
                            </div>
                            <div className="card-footer text-white bg-success">
                                Home Club
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <div className="justify-content-center d-flex">
                {networkRequest && <OrbitalLoading color='red' />}
            </div>
            {ongoigRounds.length > 0 && <h2 className='mt-3'>Ongoing Games</h2>}
            {ongoigRounds.length > 0 && 
                <Table rowKey="id" data={ongoigRounds} affixHeader affixHorizontalScrollbar autoHeight={true} hover={true} className={` ${networkRequest ? 'disabledDiv' : ''}`}>
                    {columns.map((column, idx) => {
                        const { key, label, ...rest } = column;
                        return (
                            <Column {...rest} key={key} fullText>
                                <HeaderCell>{label}</HeaderCell>
                                <Table.Cell dataKey={key} style={{ padding: 6 }} />
                            </Column>
                        );
                    })}
                    <Column width={100} >
                        <HeaderCell>Actions...</HeaderCell>
                        <ActionCell onDelete={handleOngoingGameDelete} onViewGame={handleViewOngoingGame} />
                    </Column>
                </Table>
            }
            <div className="row mt-3">
                <Col xs={12} md={12} sm={12} className="mb-2 col-12 my-2 d-flex flex-column justify-content-center">
                    <div className="card shadow border-0 rounded-3 h-100 p-4">
                        <div className="card-body">
                            <h2 className="fw-bold space-mono-bold">Game Performance Stats</h2>
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
            </div>
            <div className="row mt-3">
                <Col xs={12} md={12} sm={12} className="mb-2 col-12 my-2 d-flex flex-column justify-content-center">
                    <div className="card shadow border-0 rounded-3 h-100 p-4">
                        <div className="card-body">
                            <h2 className="fw-bold">Recent Games</h2>
                            <div className="d-flex justify-content-center flex-wrap gap-3">
                            </div>
                        </div>
                    </div>
                </Col>
            </div>
            <div className="row mt-3 mb-5">
                <div className="col-12 col-sm-3">
                    <div className="p-2">
                        <Button variant='warning' className='w-100 fw-bold' onClick={createGame}>Create Game</Button> 
                    </div>
                </div>
                <div className="col-12 col-sm-3"> 
                    <div className="p-2">
                        <Button variant='danger' className='w-100 fw-bold'>Join Game</Button> 
                    </div>
                </div>
                <div className="col-12 col-sm-3"> 
                    <div className="p-2">
                        <Button variant='primary' className='w-100 fw-bold'>Game History</Button> 
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
        </section>
    )
}

export default ClientDashboard;