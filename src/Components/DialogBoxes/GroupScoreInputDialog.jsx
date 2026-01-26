import { Button, Form, Modal } from 'react-bootstrap';

import { ThreeDotLoading } from '../react-loading-indicators/Indicator';

const GroupScoreInputDialog = ({ show, handleClose, players, message, networkRequest }) => {
    const [groupPlayers, setGroupPlayers] = useState([]);

    const modalLoaded = () => {
		setGroupPlayers([...players]);
    };

    return (
        <Modal backdrop='static' keyboard={false} show={show} onClose={handleClose} onEntered={modalLoaded}>
            <Modal.Header closeButton>
                <Modal.Title>{message}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={minimizeModal} disabled={networkRequest} style={{width: '100px'}}>
                    {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                    {!networkRequest && 'Cancel'}
                </Button>
                <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={networkRequest} style={{width: '100px'}}>
                    {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                    {!networkRequest && 'Save'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default GroupScoreInputDialog;