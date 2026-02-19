import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Divider } from 'rsuite';
import { FaTrashAlt } from "react-icons/fa";
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

import { ThreeDotLoading } from '../react-loading-indicators/Indicator';
import IMAGES from '../../assets/images';
import ImageComponent from '../ImageComponent';
import { useOngoingRound } from '../../app-context/ongoing-game-context';
import { useAuthUser } from '../../app-context/user-context';
import cryptoHelper from '../../Utils/crypto-helper';
import ErrorMessage from '../ErrorMessage';
import { toast } from 'react-toastify';

const groupChangeSchema = yup.object().shape({
    new_group: yup.object().typeError("Select new group").required("Group is required"),
});

const groupsSwapSchema = yup.object().shape({
    swapped_group: yup.object().typeError("Select new group").required("Group is required"),
    swapped_player: yup.object().typeError("Select player to swap with").required("Player required"),
});

const GroupPlayerDialog = ({ show, handleClose, handleDelete, handleChangeGroup, handleSwapPlayers, networkRequest, player }) => {
    const { ongoingGame, groups } = useOngoingRound();
    const { authUser } = useAuthUser();
    const game = ongoingGame();
    const gameGroupz = groups();
    const user = authUser();
    
    const [p, setP] = useState(null);
    const [gameGroups, setGameGroups] = useState([]);
    const [players, setPlayers] = useState([]);
    const [showDelete, setShowDelete] = useState(false);
        
    const {
        control: changeGroupControl,
        setValue: changeGroupSetValue,
        handleSubmit: handleChangeGroupSubmit,
        formState: { errors: changeGroupErrors },
    } = useForm({
            resolver: yupResolver(groupChangeSchema),
        });
        
    const {
        control: swapGroupControl,
        setValue: swapGroupSetValue,
        handleSubmit: handleSwapGroupsSubmit,
        formState: { errors: swapGroupsErrors },
    } = useForm({ resolver: yupResolver(groupsSwapSchema), });

    const modalLoaded = () => {
        changeGroupSetValue('new_group', null);
        swapGroupSetValue('swapped_group', null);
        swapGroupSetValue('swapped_player', null);
        setP(player);
        const arr = [];
        gameGroupz.forEach(group => {
            if (group.name != player.group){
                arr.push({label: 'Group ' + group.name, value: group});
            }
        });
        setGameGroups(arr);
        if(user && game){
            setShowDelete(game.creator_id == cryptoHelper.decryptData(user.id));
        }
    }
    
    const modalClosed = () => {
        /*  clear out values in NumberInput to prepare it for next show. Without this, if the next column clicked doesn't have input yet, previous values will be retained by the NumberInput
            on first click but wont appear after that.
        */
        changeGroupSetValue('new_group', null);
        swapGroupSetValue('swapped_group', null);
        swapGroupSetValue('swapped_player', null);
        handleClose();
    };

    const handleSwappedGroupSelected = (val) => {
        const arr = [];
        val.value.members.forEach(member => {
            if(member.id !== player.id){
                arr.push({label: member.fname + ' ' + member.lname, value: member});
            }
        } );
        setPlayers(arr);
    };

    const handleChangePlayerGroup = (val) => {
        if(game.group_size === val.new_group.value.members.length){
            toast.error('Selected group is full');
            return;
        }
        handleChangeGroup(val.new_group);
    };

    const handleSwappedGroupChanged = (val) => {
    };

    return (
        <Modal backdrop='static' centered show={show} onHide={modalClosed} onEntered={modalLoaded}>
            <Modal.Header closeButton>
                <Modal.Title> Player </Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    <div className='p-1 d-flex gap-2 align-items-center mb-1 mt-1 text-start' >
                        {p?.ProfileImgKeyhash && <ImageComponent image={p?.ProfileImgKeyhash} key_id={p?.ProfileImgKeyhash.key_hash} width={'100px'} height={'100px'} round={true} />}
                        {!p?.ProfileImgKeyhash && <img src={IMAGES.svg_user} width={'100px'} height={'100px'} className='rounded-circle' />}
                        <span className='d-flex flex-column align-items-start gap-1 w-100'>
                            <span className='fw-bold' style={{fontSize: '20px'}}> {p?.fname} {p?.lname} </span>
                            <div> HCP: <span className='fw-bold'>{p?.hcp}</span> </div>
                            <span className='d-flex justify-content-between w-100'>
                                <div> Current Group: <span className='fw-bold'>{p?.group}</span> </div>
                                {showDelete && <FaTrashAlt size={20} color='red' onClick={handleDelete} />}
                            </span>
                        </span>
                    </div>
                    <Divider spacing="md" label="Change Group" color="violet" labelPlacement="center" />
                    <div className="d-flex flex-column">
                        <div className={`p-1 d-flex justify-content-between gap-2 ${game?.status > 1 ? "disabledDiv" : ''}`} >
                            <Controller
                                name="new_group"
                                control={changeGroupControl}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        required
                                        name="new_group"
                                        placeholder="Select Group..."
                                        className="text-dark col-6 col-md-6"
                                        options={gameGroups}
                                        onChange={(val) => onChange(val) }
                                        value={value}
                                    />
                                )}
                            />
                            <div className="d-flex justify-content-center">
                                <Button variant="success" onClick={handleChangeGroupSubmit(handleChangePlayerGroup)} disabled={networkRequest} style={{minWidth: '120px'}}>
                                    {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                                    {!networkRequest && 'Update'}
                                </Button>
                            </div>
                        </div>
                        <ErrorMessage source={changeGroupErrors.new_group} />

                    </div>
                    <Divider spacing="md" label="Swap Group" color="violet" labelPlacement="center" />
                    <div className={`p-1 d-flex flex-column justify-content-center gap-3 ${game?.status > 1 ? "disabledDiv" : ''}`} >
                        <Controller
                            name="swapped_group"
                            control={swapGroupControl}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    required
                                    name="swapped_group"
                                    placeholder="Select Group..."
                                    className="text-dark col-12 col-md-12"
                                    options={gameGroups}
                                    onChange={(val) => { 
                                            handleSwappedGroupSelected(val);
                                            onChange(val);
                                        }
                                    }
                                    value={value}
                                />
                            )}
                        />
                        <ErrorMessage source={swapGroupsErrors.swapped_group} />
                        <Controller
                            name="swapped_player"
                            control={swapGroupControl}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    required
                                    name="swapped_player"
                                    placeholder="Select Player..."
                                    className="text-dark col-12 col-md-12"
                                    options={players}
                                    onChange={(val) => onChange(val) }
                                    value={value}
                                />
                            )}
                        />
                        <ErrorMessage source={swapGroupsErrors.swapped_player} />
                        <div className="d-flex justify-content-center mb-3">
                            <Button variant="success" onClick={handleSwapGroupsSubmit(handleSwappedGroupChanged)} disabled={networkRequest} style={{minWidth: '120px'}}>
                                {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                                {!networkRequest && 'Swap'}
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Form>
        </Modal>
    )
}

export default GroupPlayerDialog;