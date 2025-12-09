import { useEffect, useRef, useState } from "react";
import {
    Button,
    Form,
} from "react-bootstrap";
import { format } from 'date-fns';
import { ThreeDotLoading } from './react-loading-indicators/Indicator';

const GameSetup = ({ course, gameMode, setUpGame, handleCancel, networkRequest, btnRedText = 'Cancel', btnBlueText = 'Save', setShowHolesContestsModal }) => {
    return (
        <div className="p-5 border rounded-4 bg-light shadow mb-5">
            <h2 className="mb-4 text-center">{gameMode.name} Setup</h2>

            <div className="row">
                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                    <Form.Label className="fw-bold">Golf Course</Form.Label>
                    <Form.Label className="text-primary fw-bold h3">{course?.course.label}</Form.Label>
                </div>
                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                    <Form.Label className="fw-bold">Game Name</Form.Label>
                    <Form.Label className="text-primary fw-bold h3">{course?.name}</Form.Label>
                </div>
            </div>

            <div className="row">
                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                    <Form.Label className="fw-bold">Game Date</Form.Label>
                    <Form.Label className="text-primary fw-bold h3">{course ? format(course?.startDate, "yyyy-MM-dd") : ''}</Form.Label>
                </div>
                <div className="col-12 col-md-6 d-flex flex-column mt-3">
                    <div className="d-flex gap-5">
                        <div className="d-flex flex-column">
                            <Form.Label className="fw-bold">Holes</Form.Label>
                            <Form.Label className="text-primary fw-bold h3">{course?.hole_mode.label}</Form.Label>
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