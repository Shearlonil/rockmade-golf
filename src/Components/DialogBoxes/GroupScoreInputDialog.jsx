import { useState } from 'react';
import { Button, Modal, Tab, Tabs } from 'react-bootstrap';
import { NumberInput } from 'rsuite';

import { ThreeDotLoading } from '../react-loading-indicators/Indicator';
import ImageComponent from '../ImageComponent';
import IMAGES from '../../assets/images';
import { Controller, useForm } from 'react-hook-form';

const GroupScoreInputDialog = ({ show, handleClose, handleSubmitScores, handleSubmitContestScores, holeProp, players, message, selectedCol = -1 }) => {
    const [networkRequest, setNetworkRequest] = useState(false);

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
            });
        }
    };
    
    const modalClosed = () => {
        /*  clear out values in NumberInput to prepare it for next show. Without this, if the next column clicked doesn't have input yet, previous values will be retained by the NumberInput
            on first click but wont appear after that.
        */
        players.forEach(player => {
            setValue(player.id.toString(), null);
        });
        handleClose();
    };
    
    const onSubmitScores = async (val) => {
        try {
            setNetworkRequest(true);
            await handleSubmitScores(val);
            handleClose();
            setNetworkRequest(false);
        } catch (error) {
            /*  A trick. Only reset NumberInput and close the modal if no errors from handleSubmitScores    */
            setNetworkRequest(false);
        }
    };
    
    const onSubmitContestScores = async (val) => {
        try {
            setNetworkRequest(true);
            await handleSubmitContestScores(holeProp.contest, val);
            handleClose();
            setNetworkRequest(false);
        } catch (error) {
            /*  A trick. Only reset NumberInput and close the modal if no errors from handleSubmitContestScores    */
            setNetworkRequest(false);
        }
    };

    return (
        <Modal backdrop='static' keyboard={false} show={show} onHide={modalClosed} onEntered={modalLoaded}>
            <Modal.Header closeButton>
                <Modal.Title className='d-flex flex-column'>
                    <span>{message}</span>
                    <span className='fs-6'>PAR {holeProp?.par}</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey="score" id="fill-tab-example" className="mb-3" justify >
                    <Tab eventKey="score" title="Hole Scores">
                        <h6 className='text-success'>Scores</h6>
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
                        <hr />
                        <div className='d-flex gap-2 mt-3 justify-content-end'>
                            <Button variant="danger" onClick={modalClosed} disabled={networkRequest} style={{width: '100px'}}>
                                {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                                {!networkRequest && 'Cancel'}
                            </Button>
                            <Button variant="primary" onClick={handleSubmit(onSubmitScores)} disabled={networkRequest} style={{width: '100px'}}>
                                {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                                {!networkRequest && 'Save'}
                            </Button>
                        </div>
                    </Tab>
                    {holeProp && holeProp.contest && <Tab eventKey="contests" title="Contests">
                        <h6 className='text-success'>{holeProp.contest.name}</h6>
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
                                        name={`${sp.id?.toString()}_contest`}
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <NumberInput min={0} size="lg" style={{width: 100}} value={value} onChange={(val) => onChange(val)} />
                                        )}
                                    />
                                </div>
                            );
                        })}
                        <hr />
                        <div className='d-flex gap-2 mt-3 justify-content-end'>
                            <Button variant="danger" onClick={modalClosed} disabled={networkRequest} style={{width: '100px'}}>
                                {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                                {!networkRequest && 'Cancel'}
                            </Button>
                            <Button variant="primary" onClick={handleSubmit(onSubmitContestScores)} disabled={networkRequest} style={{width: '100px'}}>
                                {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                                {!networkRequest && 'Save'}
                            </Button>
                        </div>
                    </Tab>}
                </Tabs>
            </Modal.Body>
        </Modal>
    )
}

export default GroupScoreInputDialog;