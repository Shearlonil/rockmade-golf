import { useEffect, useRef, useState } from "react";
import {
    Button,
    Form,
} from "react-bootstrap";
import { format } from 'date-fns';
import { ThreeDotLoading } from './react-loading-indicators/Indicator';

const GameSetup = ({ data, gameMode, setUpGame, handleCancel, networkRequest, btnRedText = 'Cancel', btnBlueText = 'Save', setShowHolesContestsModal }) => {
    const [gameDetails, setGameDetails] = useState(null);

    useEffect(() => {
        if(data){
            /*  this component can be loaded from different pages:
                1.  from GameMode to create new game
                2.  from GameBoard to change settings of yet to play or in-play games
                In case od GameMode, startDate will be available in data. While in GameBoard, the date field will be available due to data fetch from db.
                Hence, two different setup modes: newSetup and oldSetup
            */
            data.startDate ? newSetup() : oldSetup();
        }
    }, []);

    const newSetup = () => {
        // startDate in GameMode.jsx and date in GameBoard.jsx
        setGameDetails({
            courseName: data.course.label,
            gameName: data.name,
            startDate: data.startDate,
            holeMode: data.hole_mode.label,
        });
    }

    const oldSetup = () => {
        // startDate in GameMode.jsx and date in GameBoard.jsx
        let holeMode = '';
        switch (data.hole_mode) {
            case 1:
                holeMode = "Full 18";
                break;
            case 2:
                holeMode = "Front 9";
                break;
            case 3:
                holeMode = "Back 9";
                break;
            default:
                break;
        }
        setGameDetails({
            courseName: data.Course.name,
            gameName: data.name,
            startDate: data.date,
            holeMode,
        });
    }

    return (
        <div className="p-5 border rounded-4 bg-light shadow mb-5">
            <h2 className="mb-4 text-center">{gameMode} Setup</h2>

            <div className="row">
                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                    <Form.Label className="fw-bold">Golf Course</Form.Label>
                    <Form.Label className="text-primary fw-bold h3">{gameDetails?.courseName}</Form.Label>
                </div>
                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                    <Form.Label className="fw-bold">Game Name</Form.Label>
                    <Form.Label className="text-primary fw-bold h3">{gameDetails?.gameName}</Form.Label>
                </div>
            </div>

            <div className="row">
                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                    <Form.Label className="fw-bold">Game Date</Form.Label>
                    <Form.Label className="text-primary fw-bold h3">{gameDetails ? format(gameDetails?.startDate, "yyyy-MM-dd") : ''}</Form.Label>
                </div>
                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                    <div className="d-flex gap-5">
                        <div className="d-flex flex-column">
                            <Form.Label className="fw-bold">Holes</Form.Label>
                            <Form.Label className="text-primary fw-bold h3">{gameDetails?.holeMode}</Form.Label>
                        </div>
                        <div className="d-flex flex-column">
                            <Form.Label className="fw-bold">Contests</Form.Label>
                            <Button className="btn-success fw-bold" onClick={() => setShowHolesContestsModal(true)}>Add Contests</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-row row justify-content-center container gap-3 flex-md-row-reverse mt-4">
                <Button onClick={ setUpGame } className="me-2 btn-primary col-md-4 col-sm-12" disabled={networkRequest}>
                    {!networkRequest && `${btnBlueText}`}
                    {networkRequest && <ThreeDotLoading color="#ffffff" size="small" />}
                </Button>
                <Button variant="secondary" onClick={handleCancel} className="me-2 btn-danger col-md-4 col-sm-12" disabled={networkRequest} >
                    {!networkRequest && `${btnRedText}`}
                    {networkRequest && <ThreeDotLoading color="#ffffff" size="small" />}
                </Button>
            </div>
        </div>
    )
}

export default GameSetup;