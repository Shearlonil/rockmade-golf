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

import IMAGES from "../../../assets/images";
import ImageComponent from "../../../Components/ImageComponent";
import handleErrMsg from "../../../Utils/error-handler";

const columns = [
    {
        key: 'ProfileImgKeyhash',
        label: 'Avatar',
        fixed: true,
        width: 70,
    },
    {
        key: 'fname',
        label: 'First Name',
        fixed: true,
        width: 200
    },
    {
        key: 'lname',
        label: 'Last Name',
        width: 200
    },
    {
        key: 'hc',
        label: 'Home Club',
        flexGrow: 1,
    },
    {
        key: 'hcp',
        label: 'HCP',
        width: 200
    },
];

const ImageCell = ({ rowData, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
        <div
        style={{
            width: 50,
            height: 50,
            // background: '#f5f5f5',
            borderRadius: 6,
            marginTop: 2,
            overflow: 'hidden',
            display: 'inline-block'
        }}
        >
            {rowData?.ProfileImgKeyhash && <ImageComponent image={rowData?.ProfileImgKeyhash} width={'40px'} height={'40px'} round={true} key_id={rowData?.ProfileImgKeyhash.key_hash} />}
            {!rowData?.ProfileImgKeyhash && <img src={IMAGES.member_icon} alt ="Avatar" className="rounded-circle" width={40} height={40} />}
        </div>
  </Cell>
);

const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
        <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px', width: '400px' }}>
            <IconButton icon={<GrView color='green' />} />
        </Cell>
  );
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

const Players = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const [networkRequest, setNetworkRequest] = useState(false);
    const [players, setPlayers] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    // fetch mode: home club players search or other club players search. 0 (same hc), 1 (others)
    const [fetchType, setFetchType] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    // control handleScroll behaviour of table
    const [xPos, setXPos] = useState(0);
    const [yPos, setYPos] = useState(0);

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			const searchString = event.target.value;
            setFetchType(1);
			asyncPlayersSearch();
		}
	}

    const handleTableRowClicked = (rowData) => {
        // navigate(`${rowData.game_id}/summary`);
    };

    const cancelNameSearch = () => {
        setSearchKeyword('');
        setFetchType(0);
        // initialize();
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
        const contextHeight = players.length * 46;
        const top = Math.abs(y);

        if (contextHeight - top - tableHeight < 400) {
            loadMore();
        }
    };
  
    const loadMore = async () => {
        try {
            resetAbortController();
            setNetworkRequest(true);

            let response;
            switch (fetchType) {
                case 1:
                    const data = {
                        // player_id: playerID,
                        // game_group_id: cryptoHelper.encrypt(players[players.length - 1].id.toString()), 
                        pageSize,
                        queryStr: searchKeyword,
                    }
                    // response = await userGameHistorySearch(controllerRef.current.signal, data);
                    break;
                default:
                    const datum = {
                        // player_id: playerID,
                        // game_group_id: cryptoHelper.encrypt(players[players.length - 1].id.toString()), 
                        pageSize,
                    }
                    // response = await userGameHistory(controllerRef.current.signal, datum);
                    break;
            }
            const recent = buildTableData(response.data);
            setPlayers([...players, ...recent]);

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
    
    const asyncPlayersSearch = async () => {
        /*  refs: https://stackoverflow.com/questions/65963103/how-can-i-setup-react-select-to-work-correctly-with-server-side-data-by-using  */
        try {
            setNetworkRequest(true);
            resetAbortController();
            const data = {
                // player_id: playerID,
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

    const resetAbortController = () => {
        // Cancel previous request if it exists
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
    };

    return (
        <section className='container d-flex flex-column gap-4' style={{minHeight: '60vh'}}>
            <Row className="card shadow border-0 rounded-3 mt-5">
                <div className="card-body row ms-0 me-0">
                    <div className="d-flex gap-3 align-items-center col-12 col-md-4 mb-3">
                        <img src={IMAGES.svg_playing_golf_SECONDARY} alt ="Avatar" className="rounded-circle" width={50} height={50} />
                        <span className="text-danger fw-bold h2">Players</span>
                    </div>

                    <div className="d-flex flex-column gap-2 justify-content-center col-12 col-md-4 mb-3">
                        <InputGroup inside w={300} className="border border-dark">
                            <Input value={searchKeyword} onChange={setSearchKeyword} onKeyDown={handleKeyDown} placeholder='Search games' />
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
                <Table rowKey="id" affixHeader affixHorizontalScrollbar data={players} height={tableHeight} hover={true} virtualized onScroll={handleScroll} 
                    onRowClick={data => handleTableRowClicked(data) } >
                    {columns.map((column, idx) => {
                        const { key, label, ...rest } = column;
                        if(idx === 0){
                            return (
                                <Column {...rest} key={key} fullText>
                                    <HeaderCell className='fw-bold text-dark'>{label}</HeaderCell>
                                    <ImageCell dataKey={key} />
                                </Column>
                            )
                        }
                        return (
                            <Column {...rest} key={key} fullText>
                                <HeaderCell className='fw-bold text-dark'>{label}</HeaderCell>
                                <Cell dataKey={key} style={{ padding: 6 }} />
                            </Column>
                        );
                    })}
                    <Column width={150} >
                        <HeaderCell className='fw-bold text-dark'>Actions...</HeaderCell>
                        {/* click method not given to ActionCell here as onRowClick method will still fire when any method passed on to ActionCell is called */}
                        <ActionCell />
                    </Column>
                </Table>
                {networkRequest && <FixedLoader />}
            </Box>
        </section>
    )
}

export default Players;