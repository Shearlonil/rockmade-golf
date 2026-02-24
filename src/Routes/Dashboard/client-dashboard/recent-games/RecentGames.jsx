import { useEffect, useRef, useState } from "react";
import { Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdCancel } from "react-icons/md";
import { format } from 'date-fns';
import { IoIosSearch } from "react-icons/io";
import { GrView } from "react-icons/gr";
import { Table, IconButton, Input, InputGroup, Loader, Box } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import { useAuthUser } from "../../../../app-context/user-context";
import handleErrMsg from "../../../../Utils/error-handler";
import IMAGES from "../../../../assets/images";
import cryptoHelper from "../../../../Utils/crypto-helper";
import useGameController from "../../../../api-controllers/game-controller-hook";

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

const RecentGames = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { authUser } = useAuthUser();
    const { userRecentGames, userRecentGamesSearch } = useGameController();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    
    //  data returned from DataPagination
    const [recentGames, setRecentGames] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    // fetch mode: normal fetch or game name search. 0 (normal), 1 (game name search)
    const [fetchType, setFetchType] = useState(0);
    // control handleScroll behaviour of table
    const [xPos, setXPos] = useState(0);
    const [yPos, setYPos] = useState(0);
    
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

            const response = await userRecentGames(controllerRef.current.signal, {game_group_id: cryptoHelper.encrypt('0'), pageSize});
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

    const asyncRecentGameSearch = async () => {
        /*  refs: https://stackoverflow.com/questions/65963103/how-can-i-setup-react-select-to-work-correctly-with-server-side-data-by-using  */
        try {
            setNetworkRequest(true);
            resetAbortController();
            const data = {
                game_group_id: cryptoHelper.encrypt('0'), 
                pageSize,
                queryStr: searchKeyword,
            }
            const response = await userRecentGamesSearch(controllerRef.current.signal, data);
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
  
    const handleViewGameSummary = id => {
        navigate(`/dashboard/staff/courses/${id}/view`);
    };

    const handleTableRowClicked = (rowData) => {
    };

    const cancelNameSearch = () => {
        setSearchKeyword('');
        setFetchType(0);
        initialize();
    }
  
    const loadMore = async () => {
        try {
            resetAbortController();
            setNetworkRequest(true);

            let response;
            switch (fetchType) {
                case 1:
                    const data = {
                        game_group_id: cryptoHelper.encrypt(recentGames[recentGames.length - 1].id.toString()), 
                        pageSize,
                        queryStr: searchKeyword,
                    }
                    response = await userRecentGamesSearch(controllerRef.current.signal, data);
                    break;
                default:
                    response = await userRecentGames(controllerRef.current.signal, {game_group_id: cryptoHelper.encrypt(recentGames[recentGames.length - 1].id.toString()), pageSize});
                    break;
            }
            const recent = buildTableData(response.data);
            setRecentGames([...recentGames, ...recent]);

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
                </div>
            </Row>

            <Box pos="relative">
                <Table rowKey="id" affixHeader affixHorizontalScrollbar data={recentGames} height={tableHeight} hover={true} virtualized onScroll={handleScroll} 
                    onRowClick={data => handleTableRowClicked(data) } >
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
                        <ActionCell onViewCourse={handleViewGameSummary} />
                    </Column>
                </Table>
                {networkRequest && <FixedLoader />}
            </Box>
        </section>
    )
}

export default RecentGames;