import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

import { ThreeDotLoading } from '../react-loading-indicators/Indicator';
import IMAGES from '../../assets/images';
import ImageComponent from '../ImageComponent';

const GroupPlayerDialog = ({ show, handleClose, handleDelete, networkRequest, player }) => {
    const [p, setP] = useState(null);

    const modalLoaded = () => {
        setP(player);
    }

    return (
        <Modal show={show} onHide={handleClose} onEntered={modalLoaded}>
            <Modal.Header closeButton>
                <Modal.Title> Player </Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    <div className="d-flex justify-content-center mb-4">
                        {p?.ProfileImgKeyhash && <ImageComponent image={p.ProfileImgKeyhash} key_id={p.ProfileImgKeyhash.key_hash} width={'80px'} height={'80px'} round={true} />}
                        {!p?.ProfileImgKeyhash && <img src={IMAGES.svg_user} width={'80px'} height={'80px'} className='rounded-circle' />}
                    </div>
                    <p className='text-center fw-bold'> {p?.fname} {p?.lname} </p>
                    <p className='text-center'>HCP <span className=' fw-bold text-danger'>{p?.hcp}</span></p>
                    <div className="d-flex justify-content-center mb-3">
                        <Button variant="danger" onClick={handleDelete} disabled={networkRequest} style={{minWidth: '150px'}}>
                            {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                            {!networkRequest && 'Delete'}
                        </Button>
                    </div>
                </Modal.Body>
            </Form>
        </Modal>
    )
}

export default GroupPlayerDialog;