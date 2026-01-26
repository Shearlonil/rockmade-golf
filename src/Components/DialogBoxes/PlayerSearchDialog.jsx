import { useRef, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import { toast } from 'react-toastify';

import { ThreeDotLoading } from '../react-loading-indicators/Indicator';
import handleErrMsg from '../../Utils/error-handler';
import useUserController from '../../api-controllers/user-controller-hook';
import ImageComponent from '../ImageComponent';
import IMAGES from '../../assets/images';

const PlayerSearchDialog = ({ show, handleClose, handleSubmitPlayers, message, multiSelect = false, size = 3, networkRequest }) => {
    const controllerRef = useRef(new AbortController());

    const { gameUserSearch, } = useUserController();

    const [playerOptions, setPlayerOptions] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [maxSelection, setMaxSelection] = useState(0);

    const modalLoaded = () => {
        setMaxSelection(size);
    };

    const minimizeModal = () => {
        // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
        setSelectedPlayers([]);
        resetAbortController();
        handleClose();
    }

    const {
        handleSubmit,
        control,
        setValue,
    } = useForm({});
    
    const onSubmit = async () => {
        try {
            await handleSubmitPlayers(selectedPlayers);
            setSelectedPlayers([]);
        } catch (error) {
            /*  A trick to prevent clearing selectedPlayers. Only clear if no error from handleSubmitPlayers    */
        }
    };
    
    const handlePlayerChange = async (data) => {
        if(data){
            if(multiSelect){
                if(maxSelection === 0){
                    return;
                }
                const idx = selectedPlayers.findIndex(player => player.id === data.value.id);
                if(idx !== -1){
                    toast.info("Player already added");
                    return;
                }
                setSelectedPlayers([...selectedPlayers, data.value]);
                setMaxSelection(maxSelection - 1);
                if(multiSelect){
                    setValue('players', null);
                }
            }else {
                setSelectedPlayers([data.value]);
            }
        }
    };
    
    const remove = (data) => {
        const temp = [...selectedPlayers];
        const idx = temp.findIndex(player => player.id === data.id);
        temp.splice(idx, 1);
        setMaxSelection(maxSelection + 1);
        setSelectedPlayers(temp);
    };

    const asyncPlayerSearch = async (inputValue, callback) => {
        /*  refs: https://stackoverflow.com/questions/65963103/how-can-i-setup-react-select-to-work-correctly-with-server-side-data-by-using  */
        try {
            resetAbortController();
            const response = await gameUserSearch(controllerRef.current.signal, {inputValue});
            const results = response.data.map(user => ({label: user.fname + " " + user.lname, value: user}));
            setPlayerOptions(results);
            callback(results);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
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
        <Modal show={show} onHide={minimizeModal} onEntered={modalLoaded} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{message}</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    <div className="d-flex flex-column">
                        <Controller
                            name="players"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <AsyncSelect
                                    className="text-dark w-100"
                                    isClearable
                                    // getOptionLabel={getOptionLabel}
                                    getOptionValue={(option) => option}
                                    // defaultValue={initialObject}
                                    defaultOptions={playerOptions}
                                    cacheOptions
                                    loadOptions={asyncPlayerSearch}
                                    value={value}
                                    onChange={(val) => {
                                        onChange(val);
                                        handlePlayerChange(val);
                                    } }
                                />
                            )}
                        />
                    </div>
                    {multiSelect && selectedPlayers.map((sp, i) => {
                        return (
                            <div width={'100%'} key={i} className="position-relative">
                                <div key={i} className={`p-3 border rounded d-flex align-items-center shadow-sm gap-2 mt-3 w-100`} >
                                    {sp.ProfileImgKeyhash && <ImageComponent image={sp.ProfileImgKeyhash} width={'30px'} height={'30px'} round={true} key_id={sp.ProfileImgKeyhash.key_hash} />}
                                    {!sp.ProfileImgKeyhash && <img src={IMAGES.svg_user} width={'30px'} height={'30px'} className='rounded-circle' />}
                                    <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-0">{sp.fname} {sp.lname}</h6>
                                        <small className="text-muted">
                                            {sp.Course.name} | HC: {sp.hcp}
                                        </small>
                                    </div>
                                </div>
                                <span className="position-absolute start-100 top-0 translate-middle p-1 fw-bold bg-danger rounded-circle text-white mt-1 btn shadow-sm" style={{fontSize: 10, width: 25}} onClick={() => remove(sp)}>
                                    X
                                </span>
                            </div>
                        );
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={minimizeModal} disabled={networkRequest} style={{width: '100px'}}>
                        {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                        {!networkRequest && 'Cancel'}
                    </Button>
                    <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={networkRequest} style={{width: '100px'}}>
                        {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                        {!networkRequest && 'Add'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default PlayerSearchDialog;