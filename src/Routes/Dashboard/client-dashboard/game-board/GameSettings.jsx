import { Button, Col, Row } from 'react-bootstrap';
import { GiGamepadCross, GiPlayerTime } from "react-icons/gi";
import IMAGES from '../../../../assets/images';

const GameSettings = ({changePageNumber}) => {
    return (
        <Row>
            <Col xs={12} md={4} sm={12} className="mb-2">
                <div className="p-2 h-100">
                    <div className="card shadow border-0 rounded-3 h-100">
                        <div className="card-body d-flex flex-column justify-content-between" style={{minHeight: '300px'}}>
                            <GiGamepadCross size={40} className='text-primary' />
                            <h2>Game Setup</h2>
                            <ul>
                                <li> Adjust game name, date, etc </li>
                                <li> Add Contests to spice up games </li>
                            </ul>
                            <span>Setup Games as needed</span>
                            <Button variant='primary' onClick={() => changePageNumber(4)}>Setup</Button>
                        </div>
                    </div>
                </div>
            </Col>
            <Col xs={12} md={4} sm={12} className="mb-2">
                <div className="p-2 h-100">
                    <div className="card shadow border-0 rounded-3 h-100">
                        <div className="card-body d-flex flex-column justify-content-between" style={{minHeight: '300px'}}>
                            <img src={IMAGES.golf_course} alt ="Avatar" className="rounded-circle" width={40} height={40} />
                            <h2>Course Setup</h2>
                            <ul>
                                <li> Update/Change Golf Course </li>
                                <li> Adjust number of holes </li>
                            </ul>
                            <span>Setup Golf Course as needed</span>
                            <Button variant='success' onClick={() => changePageNumber(5)}>Setup</Button>
                        </div>
                    </div>
                </div>
            </Col>
            <Col xs={12} md={4} sm={12} className="mb-2">
                <div className="p-2 h-100">
                    <div className="card shadow border-0 rounded-3 h-100">
                        <div className="card-body d-flex flex-column justify-content-between" style={{minHeight: '300px'}}>
                            <GiPlayerTime size={40} className='text-danger' />
                            <h2>Players</h2>
                            <ul>
                                <li> Create Groups </li>
                                <li> Add player to groups </li>
                            </ul>
                            <span>Create groups and add players as needed</span>
                            <Button variant='danger' onClick={() => changePageNumber(6)}>Setup</Button>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default GameSettings;