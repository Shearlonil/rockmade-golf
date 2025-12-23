import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import numeral from 'numeral';

import { ThreeDotLoading } from '../react-loading-indicators/Indicator';
import DpUploader from '../DpUploader';

const ProfileImgDialog = ({ show, handleClose, handleConfirm, networkRequest }) => {
    const [dp, setDp] = useState(null);
    /*  1024 * 1024 = 1 mb
        20 * 1024 * 1024 = 20MB
    */
    
    const onSubmit = async () => {
        if(dp){
            handleConfirm(dp);
        }else {
            toast.info("Please select a valid image to upload");
        }
    };

    const setImageURL = (file) => {
        if(file.size > (5 * 1024 * 1024)){
            toast.error(
                `Current file size is ${numeral(file.size).format('0.0b')}. This is greater than the acceptable file size. Please select an image with file within the accetable range`,
                { autoClose: false }
            );
            setDp(null);
            return;
        }
        setDp(file);
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title> Upload a photo </Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    <div className="d-flex justify-content-center w-100 mb-4">
                        <DpUploader setImageURL={setImageURL} />
                    </div>
                    <p className='text-center fw-bold text-danger'>Select an image not more than 5MB</p>
                    <div className="d-flex justify-content-center mb-3">
                        <Button variant="primary" onClick={onSubmit} disabled={networkRequest} style={{minWidth: '150px'}}>
                            {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                            {!networkRequest && 'Upload Image'}
                        </Button>
                    </div>
                </Modal.Body>
            </Form>
        </Modal>
    )
}

export default ProfileImgDialog;