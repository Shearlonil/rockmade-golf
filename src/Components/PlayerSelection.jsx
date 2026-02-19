import { useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap';
import { IoMdAddCircle } from "react-icons/io";
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';

import { useAuthUser } from '../app-context/user-context';
import IMAGES from '../assets/images';
import { groupSizeOptions } from '../Utils/data';
import ImageComponent from './ImageComponent';
import PlayerSearchDialog from './DialogBoxes/PlayerSearchDialog';
import useGameController from '../api-controllers/game-controller-hook';
import handleErrMsg from '../Utils/error-handler';
import GroupPlayerDialog from './DialogBoxes/GroupPlayerDialog';
import ConfirmDialog from './DialogBoxes/ConfirmDialog';
import { useOngoingRound } from '../app-context/ongoing-game-context';

const PlayerSelection = () => {
    const controllerRef = useRef(new AbortController());
    const { addPlayers, removePlayer, updatePlayerGroup } = useGameController();
    const { authUser } = useAuthUser();
    const { ongoingGame, scores, setScores, groups, setGroups, setOngoingGame } = useOngoingRound();
    const game = ongoingGame();
    const gameGroupArr = groups();
    const playerScores = scores();
    const user = authUser();

    const [networkRequest, setNetworkRequest] = useState(false);
    const [showGroupPlayer, setShowGroupPlayer] = useState(false);
    const [showShowPlayerSearchDialog, setShowPlayerSearchDialog] = useState(false);
    const [sizeOfGroup, setSizeOfGroup] = useState(4);
	const [displayMsg, setDisplayMsg] = useState("");
	const [selectedGroupPlayer, setSelectedGroupPlayer] = useState(null);
	const [changedPlayerGroupDetails, setChangedPlayerGroupDetails] = useState(null);
    const [swappedPlayers, setSwappedPlayers] = useState(null);
    // group which player is being added
	const [activeGroup, setActiveGroup] = useState(null);
    // number of players to search in player dialog
	const [numOfPlayers, setNumOfPlayers] = useState(4);

	const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmDialogEvtName, setConfirmDialogEvtName] = useState(null);
    
    const {
        control,
        setValue,
    } = useForm({});

    useEffect(() => {
        if(game){
            setSizeOfGroup(game.group_size);
            const defaultGroupSize = groupSizeOptions.find(a => a.value === game.group_size );
            setValue('group_size', defaultGroupSize);
        }
    }, [gameGroupArr, game]);

	const handleCloseModal = () => {
        setShowPlayerSearchDialog(false);
        setShowConfirmModal(false);
    };

	const handleCloseGroupPlayerModal = () => {
        setShowGroupPlayer(false);
    };
  
    const handleSubmitPlayers = async (data) => {
        // even though number of players to be selected is monitored in PlayerSearchDialog, one can't be too carefull. Check if players selected doesn't exceed required number
        if(data.length + activeGroup.members.length > sizeOfGroup){
            toast.error("Invalid number of players selected. Consider removing some players");
            throw new Error("Invalid number of players selected");
        }
        try {
            if(data.length > 0){
                const arr = [];
                for (const datum of data) {
                    gameGroupArr.forEach(g => {
                        const find = g.members.find(member => member.id === datum.id);
                        if(find){
                            toast.error(`${find.fname} ${find.lname} already added to group ${g.name}`);
                            throw new Error('Cannot add player twice');
                        }
                    })
                    arr.push(datum.id);
                }
                const payload = {
                    game_id: game.id,
                    currentGroupSize: sizeOfGroup,
                    players: arr,
                    groupProp: {
                        round_no: game.current_round,
                        group_name: activeGroup.name,
                    }
                }
                setNetworkRequest(true);
                resetAbortController();
                await addPlayers(controllerRef.current.signal, payload);
                const temp = [...gameGroupArr];
                const g = temp.find(t => t.name === activeGroup.name);
                g.members.push(...data);
                setGroups(temp);
                setNetworkRequest(false);
                setActiveGroup(null);
            }else {
                toast.info("Please select players");
                throw new Error("Please select players");
            }
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
            throw new Error(handleErrMsg(error).msg);
        }
        setShowPlayerSearchDialog(false);
    };

    const handlePlayerClicked = (groupName, player) => {
        setSelectedGroupPlayer({
            group: groupName,
            ...player
        })
        setShowGroupPlayer(true);
    };

    const handleAddPlayerButton = (group) => {
        setActiveGroup(group);
        setDisplayMsg("Search Player");
        setNumOfPlayers(sizeOfGroup - group.members.length);
        setShowPlayerSearchDialog(true);
    };

    const handleAddGroup = () => {
        const temp = {
            name: (gameGroupArr.length + 1).toString(),
            members: [],
            isNew: true,
        };
        setGroups([...gameGroupArr, temp]);
    };

    const handleGroupSizeChanged = (val) => {
        setSizeOfGroup(val.value);
        const temp = {...game}
        temp.group_size = val.value
        setOngoingGame(temp);
    };

    const handleDeleteGroupPlayer = () => {
        setDisplayMsg(`Remove ${selectedGroupPlayer.fname} ${selectedGroupPlayer.lname} from game?. Action cannot be undone!!`);
        setConfirmDialogEvtName('delGroupPlayer');
        setShowConfirmModal(true);
    };

    const handleChangeGroup = (group) => {
        setChangedPlayerGroupDetails(group);
        setDisplayMsg(`Move ${selectedGroupPlayer.fname} ${selectedGroupPlayer.lname} from ${selectedGroupPlayer.group} to ${group.label}?`);
        setConfirmDialogEvtName('changePlayerGroup');
        setShowConfirmModal(true);
    };
  
    const handleConfirm = async () => {
        setShowConfirmModal(false);
        switch (confirmDialogEvtName) {
            case "delGroupPlayer":
                deleteGroupPlayer();
            case "changePlayerGroup":
                changePlayerGroup();
        }
    };

    const deleteGroupPlayer = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            await removePlayer(controllerRef.current.signal, {game_id: game.id, player_id: selectedGroupPlayer.id});
            const temp = [...gameGroupArr];
            const group = temp.find(arr => arr.name === selectedGroupPlayer.group);
            // remove player from group
            const newMembers = group.members.filter(member => member.id !== selectedGroupPlayer.id);
            // remove player scores from all scores
            const newScores = playerScores.filter(score => score.id !== selectedGroupPlayer.id);
            group.members = newMembers;
            setGroups(temp);
            setScores(newScores);
            setSelectedGroupPlayer(null);
            setShowGroupPlayer(false);
            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const changePlayerGroup = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            const groupNo = changedPlayerGroupDetails.label.split(' ')[1];
            const payload = {
                game_id: game.id,
                currentGroupSize: sizeOfGroup,
                player_id: selectedGroupPlayer.id,
                groupProp: {
                    round_no: game.current_round,
                    group_name: groupNo,
                }
            };
            await updatePlayerGroup(controllerRef.current.signal, payload);
            const temp = [...gameGroupArr];
            const prevGroup = temp.find(arr => arr.name === selectedGroupPlayer.group);
            // remove player from previous group
            const newMembers = prevGroup.members.filter(member => member.id !== selectedGroupPlayer.id);
            prevGroup.members = newMembers;
            // add to new group
            const newGroup = temp.find(arr => arr.name === groupNo);
            if(newGroup){
                newGroup.members.push(selectedGroupPlayer);
            }else {
                // newly created/added group
                temp.push({
                    name: groupNo,
                    members: [user]
                });
            }
            // update group value in selectedPlayer
            selectedGroupPlayer.group = groupNo;
            // update group of player in scores (in ongoing-game-context)
            const playerScore = playerScores.find(score => score.id === selectedGroupPlayer.id);
            playerScore.group = groupNo;
            setGroups(temp);
            setScores(playerScores);
            
            setSelectedGroupPlayer(null);
            setChangedPlayerGroupDetails(null);
            setShowGroupPlayer(false);
            setNetworkRequest(false);
        } catch (error) {
            console.log(error);
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const buildGroup = (datum, idx) => {
        return <div className='col-md-4 col-sm-12 mb-3' key={idx}>
            <div className='card border-0 rounded-4 bg-light shadow'>
                <div className='d-flex flex-wrap p-2'>
                    {new Array(sizeOfGroup).fill(1).map((val, index) => {
                        if(datum.members[index]){
                            return <div className='p-1 w-50 d-flex gap-2 align-items-center mb-1 mt-1 text-start' key={index} onClick={() => handlePlayerClicked(datum.name, datum.members[index])}>
                                {datum.members[index].ProfileImgKeyhash && <ImageComponent image={datum.members[index].ProfileImgKeyhash} key_id={datum.members[index].ProfileImgKeyhash.key_hash} width={'30px'} height={'30px'} round={true} />}
                                {!datum.members[index].ProfileImgKeyhash && <img src={IMAGES.svg_user} width={'30px'} height={'30px'} className='rounded-circle' />}
                                <span className='d-flex flex-column align-items-start gap-1'>
                                    <span className='fw-bold' style={{fontSize: '12px'}}> {datum.members[index]?.fname} {datum.members[index]?.lname} </span>
                                    <div> HCP: <span className='fw-bold'>{datum.members[index]?.hcp}</span> </div>
                                </span>
                            </div>
                        }else {
                            return <span className='p-1 w-50 mb-1 mt-1' key={index}>
                                <Button variant="success" className="fw-bold w-100" onClick={() => handleAddPlayerButton(datum)} key={index}>
                                    <IoMdAddCircle size='25px' /> Add Player
                                </Button>
                            </span>
                        }
                    })}
                </div>
                <div className="card-footer fw-bold bg-primary text-white">
                    Group {datum.name}
                </div>
            </div>
        </div>
    };

    const buildPlayerGroups = gameGroupArr.map((datum, i) => { return buildGroup(datum, i) });

    const resetAbortController = () => {
        // Cancel previous request if it exists
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
    };

    return (
        <div className="mb-5">
            <div className="text-center container">
                <div className='row'>
                    <div className="col-sm-12 col-md-4 mb-3 d-flex gap-3 align-items-center justify-content-center">
                        <Button variant="success" className="fw-bold col-12 col-md-6" onClick={handleAddGroup}>
                            <IoMdAddCircle size='32px' /> Add Group
                        </Button>
                    </div>
                    <h2 className="mb-3 col-12 col-md-4">Players</h2>
                    <div className="d-flex gap-4 col-12 col-md-4 mb-3">
                        <div className="d-flex flex-column w-100 gap-2">
                            <span className="align-self-start fw-bold">Group Size</span>
                            <div className="d-flex gap-3">
                                <Controller
                                    name="group_size"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            required
                                            name="group_size"
                                            placeholder="Group Size..."
                                            className="text-dark col-5 col-md-4"
                                            defaultValue={groupSizeOptions[2]}
                                            options={groupSizeOptions}
                                            onChange={(val) => { 
                                                handleGroupSizeChanged(val);
                                                onChange(val);
                                            }}
                                            isDisabled={game?.status > 1 ? true : false}
                                            value={value}
                                        />
                                    )}
                                />
                                <Button variant="primary" className="fw-bold col-6" onClick={handleAddGroup}>
                                    SAVE
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PLAYER GRID */}
                <div className="mb-4 row">
                    {buildPlayerGroups}
                </div>
            </div>
			<PlayerSearchDialog
				show={showShowPlayerSearchDialog}
				handleClose={handleCloseModal}
				handleSubmitPlayers={handleSubmitPlayers}
                multiSelect={true}
				message={displayMsg}
                size={numOfPlayers}
                networkRequest={networkRequest}
			/>
			<GroupPlayerDialog
				show={showGroupPlayer}
				handleClose={handleCloseGroupPlayerModal}
				handleDelete={handleDeleteGroupPlayer}
                handleChangeGroup={handleChangeGroup}
                player={selectedGroupPlayer}
				message={displayMsg}
			/>
			<ConfirmDialog
				show={showConfirmModal}
				handleClose={handleCloseModal}
				handleConfirm={handleConfirm}
				message={displayMsg}
			/>
        </div>
    )
}

export default PlayerSelection;