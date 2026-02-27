import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

import { useAuth } from '../../../../app-context/auth-context';
import { useAuthUser } from '../../../../app-context/user-context';
import ImageComponent from '../../../../Components/ImageComponent';
import IMAGES from '../../../../assets/images';
import handleErrMsg from '../../../../Utils/error-handler';
import useUserController from '../../../../api-controllers/user-controller-hook';

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

    const { logout } = useAuth();
    const { authUser } = useAuthUser();
    const user = authUser();

    const [player, setPlayer] = useState(null);
    const [networkRequest, setNetworkRequest] = useState(true);
    const [coursesPlayed, setCoursesPlayed] = useState(0);
    
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
            setNetworkRequest(true);
            const response = await playerInfo(controllerRef.current.signal, id);
            if(response && response.data){
                setPlayer(response.data.user);
                setCoursesPlayed(response.data.courses_played)
                const recent = buildTableData(response.data.recent_games);
                setRecentGames(recent);
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
    
    return (
        <section className='container d-flex flex-column gap-4' style={{minHeight: '80vh'}}>
            <Row className='mt-4'>
                <div className="d-flex flex-wrap gap-4 align-items-center justify-content-start col-md-8 col-sm-12" >
                    {!networkRequest && <>
                        {player?.ProfileImgKeyhash && <ImageComponent image={player?.ProfileImgKeyhash} width={'100px'} height={'100px'} round={true} key_id={player?.ProfileImgKeyhash.key_hash} />}
                        {!player?.ProfileImgKeyhash && <img src={IMAGES.member_icon} alt ="Avatar" className="rounded-circle" width={100} height={100} />}
                        <div className="d-flex flex-column">
                            <span className="fw-bold h2">{player?.fname} {player?.lname}</span>
                            <div> HCP: <span>{player?.hcp}</span> </div>
                            <div><span>{player?.Course.name}</span> </div>
                        </div>
                    </>}
                    {networkRequest && <div className="card-body">
                        <div className='d-flex flex-column justify-content-between'>
                            <Skeleton count={4} style={{width: '100%'}} />
                        </div>
                        <Skeleton count={2} style={{width: '100%'}} />
                    </div>}
                </div>
                <Col xs={12} md={4} sm={12} className="mb-2">
                    <div className="p-2 h-100">
                        <div className="card shadow border-0 rounded-3 h-100">
                            {!networkRequest && <div className="card-body">
                                <div className='d-flex justify-content-between'>
                                    <span className='h1 text-danger fw-bold' style={{fontSize: '50px'}}>{coursesPlayed}</span>
                                </div>
                                <span>Number of courses played</span>
                            </div>}
                            {networkRequest && <div className="card-body">
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
        </section>
    )
}

export default PlayerInfo;