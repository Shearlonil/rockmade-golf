import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { IoIosSearch } from "react-icons/io";
import { GrView } from "react-icons/gr";
import { MdCancel } from "react-icons/md";
import { format } from 'date-fns';
import Skeleton from 'react-loading-skeleton';
import { Table, IconButton, Input, InputGroup, Loader, Box } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import { useAuth } from '../../../../app-context/auth-context';
import { useAuthUser } from '../../../../app-context/user-context';
import ImageComponent from '../../../../Components/ImageComponent';
import IMAGES from '../../../../assets/images';
import handleErrMsg from '../../../../Utils/error-handler';
import useUserController from '../../../../api-controllers/user-controller-hook';
import useGameController from '../../../../api-controllers/game-controller-hook';
import cryptoHelper from '../../../../Utils/crypto-helper';
import UserPlayedCoursesDialog from '../../../../Components/DialogBoxes/UserPlayedCoursesDialog';

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

const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px', width: '400px' }}>
            <IconButton icon={<GrView color='green' />} />
        </Cell>
  );
};

const FixedLoader = () => (
    <Loader
        content="Loading..."
        style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            bottom: '0',
            background: 'var(--rs-body)',
            width: '100%',
            padding: '4px 0'
        }}
    />
);

const tableHeight = 500;

const buildTableData = (data) => {
    return data.map(r => {
        let hole_mode = 'Full 18';
        let mode = 'Member Games';
        if(r.hole_mode === 2){
            hole_mode = 'Font 9'
        }else if(r.hole_mode === 3) {
            hole_mode = 'Back 9'
        }
        if(r.mode === 1){
            mode = 'Tournament'
        }
        return {
            id: r.id,
            game_id: r.game_id,
            name: r.name,
            date: format(r.date, "dd/MM/yyyy"),
            hole_mode,
            mode,
            players: r.players
        }
    });
};

const PlayerInfo = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const { playerInfo } = useUserController();
    const { userGameHistory, userGameHistorySearch } = useGameController();

    const { logout } = useAuth();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [player, setPlayer] = useState(null);
    const [networkRequest, setNetworkRequest] = useState(false);
    const [pageLoad, setPageLoad] = useState(true);
    const [coursesPlayed, setCoursesPlayed] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
	const [showCoursesPlayed, setShowCoursesPlayed] = useState(false);
    
    const [recentGames, setRecentGames] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    // fetch mode: normal fetch or game name search. 0 (normal), 1 (game name search)
    const [fetchType, setFetchType] = useState(0);
    // control handleScroll behaviour of table
    const [xPos, setXPos] = useState(0);
    const [yPos, setYPos] = useState(0);
    
    useEffect(() => {
        if(!user){
            logout();
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
            setPageLoad(true);
            const response = await playerInfo(controllerRef.current.signal, id);
            if(response && response.data){
                setPlayer(response.data.user);
                setCoursesPlayed(response.data.courses_played)
                const recent = buildTableData(response.data.recent_games);
                setRecentGames(recent);
            }
            setPageLoad(false);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setPageLoad(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const asyncRecentGameSearch = async () => {
        /*  refs: https://stackoverflow.com/questions/65963103/how-can-i-setup-react-select-to-work-correctly-with-server-side-data-by-using  */
        try {
            setNetworkRequest(true);
            resetAbortController();
            const data = {
                player_id: id,
                game_group_id: cryptoHelper.encrypt(Number.MAX_VALUE.toString()), 
                // game_group_id: cryptoHelper.encrypt('0'), 
                pageSize,
                queryStr: searchKeyword,
            }
            const response = await userGameHistorySearch(controllerRef.current.signal, data);
            const recent = buildTableData(response.data);
            setRecentGames(recent);
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

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			const searchString = event.target.value;
            setFetchType(1);
			asyncRecentGameSearch();
		}
	}

    const handleScroll = (x, y) => {
        /*  This method only handles user scroll, both x or y scrolling. Which means even when the user scrolls x wise, this method fires. To stop network request or limit network request
            to only y scrolling, note the y position when the user scrolls x wise. Only engage network request if y !== yPos (stored y position when the user scrolls x wise)*/
        if(x !== xPos){
            /*  when x !== xPos (previously stored x postion, then user is scrolling x wise). Store new position and note current y positon. 
                NOTE: When the user scrolls and the scroll bar reaches the edge of the screen, then x === xPos and this if block won't execute. To only engange network activity in this case,
                the next if block checks if y === yPos, then no y scrolling but the user still scrolling x wise while scroll bar reaches edge of the screen
            */
            setXPos(x);
            setYPos(y);
            return;
        }
        if(y === yPos){
            // this prevents network request when the user scrolls x wise but reaches end of x, i. e scroll bar reaches edge of the screen. 
            return;
        }
        const contextHeight = recentGames.length * 46;
        const top = Math.abs(y);

        if (contextHeight - top - tableHeight < 400) {
            loadMore();
        }
    };

	const handleCloseModal = () => {
        setShowCoursesPlayed(false);
    };

    const viewUserPlayedCourses = () => setShowCoursesPlayed(true);

    const handleTableRowClicked = (rowData) => {
        navigate(`/dashboard/client/games/history/${rowData.game_id}/summary`);
    };
  
    const loadMore = async () => {
        try {
            resetAbortController();
            setNetworkRequest(true);

            let response;
            switch (fetchType) {
                case 1:
                    const data = {
                        player_id: id,
                        game_group_id: cryptoHelper.encrypt(recentGames[recentGames.length - 1].id.toString()), 
                        pageSize,
                        queryStr: searchKeyword,
                    }
                    response = await userGameHistorySearch(controllerRef.current.signal, data);
                    break;
                default:
                    const datum = {
                        player_id: id,
                        game_group_id: cryptoHelper.encrypt(recentGames[recentGames.length - 1].id.toString()), 
                        pageSize,
                    }
                    response = await userGameHistory(controllerRef.current.signal, datum);
                    break;
            }
            if(response && response.data && response.data.length > 0){
                const recent = buildTableData(response.data);
                setRecentGames([...recentGames, ...recent]);
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

    const cancelNameSearch = () => {
        setSearchKeyword('');
        setFetchType(0);
        fetchHistory();
    }

    const fetchHistory = async () => {
        try {
            controllerRef.current = new AbortController();
            setNetworkRequest(true);
            const datum = {
                player_id: id,
                game_group_id: cryptoHelper.encrypt(Number.MAX_VALUE.toString()), 
                pageSize,
            }
            const response = await userGameHistory(controllerRef.current.signal, datum);
            if(response && response.data && response.data.length > 0){
                const recent = buildTableData(response.data);
                setRecentGames([...recent]);
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

    const resetAbortController = () => {
        // Cancel previous request if it exists
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
    };
    
    return (
        <section className='container d-flex flex-column gap-4' style={{minHeight: '80vh'}}>
            <Row className='mt-4'>
                <div className="d-flex flex-wrap gap-4 align-items-center justify-content-start col-md-8 col-sm-12" >
                    {!pageLoad && <>
                        {player?.ProfileImgKeyhash && <ImageComponent image={player?.ProfileImgKeyhash} width={'100px'} height={'100px'} round={true} key_id={player?.ProfileImgKeyhash.key_hash} />}
                        {!player?.ProfileImgKeyhash && <img src={IMAGES.member_icon} alt ="Avatar" className="rounded-circle" width={100} height={100} />}
                        <div className="d-flex flex-column">
                            <span className="fw-bold h2">{player?.fname} {player?.lname}</span>
                            <div> HCP: <span>{player?.hcp}</span> </div>
                            <div>{player?.Course.name} </div>
                        </div>
                    </>}
                    {pageLoad && <div className="card-body">
                        <div className='d-flex flex-column justify-content-between'>
                            <Skeleton count={4} style={{width: '100%'}} />
                        </div>
                        <Skeleton count={2} style={{width: '100%'}} />
                    </div>}
                </div>
                <Col xs={12} md={4} sm={12} className="mb-2">
                    <div className="p-2 h-100">
                        <div className="card shadow border-0 rounded-3 h-100">
                            {!pageLoad && <div className="card-body">
                                <div className='d-flex justify-content-between'>
                                    <span className='h1 text-danger fw-bold' style={{fontSize: '50px'}}>{coursesPlayed}</span>
                                </div>
                                <Button variant='outline-danger' style={{width: '100px'}} onClick={viewUserPlayedCourses}>View</Button>
                            </div>}
                            {pageLoad && <div className="card-body">
                                <div className='d-flex flex-column justify-content-between'>
                                    <Skeleton count={4} style={{width: '100%'}} />
                                </div>
                                <Skeleton count={2} style={{width: '100%'}} />
                            </div>}
                            <div className="card-footer text-white bg-danger">
                                Courses Played
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="mb-3 col-md-4 col-sm-12">
                <InputGroup inside w={300} className="border border-dark">
                    <Input value={searchKeyword} onChange={setSearchKeyword} placeholder='Search games' onKeyDown={handleKeyDown} />
                    {searchKeyword ? (
                        <InputGroup.Button onClick={cancelNameSearch}>
                            <MdCancel color="red" />
                        </InputGroup.Button>
                    ) : (
                        <InputGroup.Addon>
                            <IoIosSearch />
                        </InputGroup.Addon>
                    )}
                </InputGroup>
            </div>
            
            <Box pos="relative">
                <Table rowKey="id" affixHeader affixHorizontalScrollbar data={recentGames} height={tableHeight} hover={true} virtualized 
                    onScroll={handleScroll} onRowClick={data => handleTableRowClicked(data) } >
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
                        {/* click method not given to ActionCell here as onRowClick method will still fire when any method passed on to ActionCell is called */}
                        <ActionCell />
                    </Column>
                </Table>
                {networkRequest && <FixedLoader />}
            </Box>
            <UserPlayedCoursesDialog
                show={showCoursesPlayed}
                handleClose={handleCloseModal}
                user_id={id}
            />
        </section>
    )
}

export default PlayerInfo;