import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { NumberInput } from 'rsuite';

import { ThreeDotLoading } from '../react-loading-indicators/Indicator';
import ImageComponent from '../ImageComponent';
import IMAGES from '../../assets/images';
import { Controller, useForm } from 'react-hook-form';

const GroupScoreInputDialog = ({ show, handleClose, handleSubmitScores, par, players, message, networkRequest, selectedCol = -1 }) => {
    const [groupPlayers, setGroupPlayers] = useState([]);

	const {
		handleSubmit,
		control,
		setValue,
	} = useForm();

    const handleMinus = () => {
        setValue(parseInt(value, 10) - 1);
    };
    const handlePlus = () => {
        setValue(parseInt(value, 10) + 1);
    };

    const modalLoaded = () => {
        if(selectedCol > 0 && players){
            players.forEach(player => {
                setValue(player.id.toString(), player[selectedCol]);
            })
        }
		setGroupPlayers([...players]);
    };
    
    const onSubmit = async (val) => {
        try {
            await handleSubmitScores(val);
        } catch (error) {
            /*  A trick to prevent clearing selectedPlayers. Only clear if no error from handleSubmitPlayers    */
        }
    };

    return (
        <Modal backdrop='static' keyboard={false} show={show} onHide={handleClose} onEntered={modalLoaded}>
            <Modal.Header closeButton>
                <Modal.Title className='d-flex flex-column'>
                    <span>{message}</span>
                    <span className='fs-6'>PAR {par}</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {players && players.map((sp, i) => {
                    return (
                        <div width={'100%'} key={i} className={`p-3 d-flex align-items-center shadow-sm gap-2 mt-3 w-100`} >
                            {sp.ProfileImgKeyhash && <ImageComponent image={sp.ProfileImgKeyhash} width={'30px'} height={'30px'} round={true} key_id={sp.ProfileImgKeyhash.key_hash} />}
                            {!sp.ProfileImgKeyhash && <img src={IMAGES.svg_user} width={'30px'} height={'30px'} className='rounded-circle' />}
                            <div className="flex-grow-1">
                                <h6 className="fw-bold mb-0">{sp.name}</h6>
                                <small className="text-muted">
                                    HCP: {sp.hcp}
                                </small>
                            </div>
                            <Controller
								name={sp.id?.toString()}
								control={control}
								render={({ field: { onChange, value } }) => (
                                    <NumberInput min={0} size="lg" style={{width: 100}} value={value} onChange={(val) => onChange(val)} />
								)}
							/>
                        </div>
                    );
                })}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose} disabled={networkRequest} style={{width: '100px'}}>
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