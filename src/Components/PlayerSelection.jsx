import { useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap';
import { IoMdAddCircle } from "react-icons/io";
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

import IMAGES from '../assets/images';
import { groupSizeOptions } from '../Utils/data';
import ImageComponent from './ImageComponent';
import PlayerSearchDialog from './DialogBoxes/PlayerSearchDialog';
import useGameController from '../api-controllers/game-controller-hook';
import handleErrMsg from '../Utils/error-handler';
import GroupPlayerDialog from './DialogBoxes/GroupPlayerDialog';
import ConfirmDialog from './DialogBoxes/ConfirmDialog';
import { useOngoingRound } from '../app-context/ongoing-game-context';
import { UserScore } from '../Entities/UserScore';

const groupSizeSchema = yup.object().shape({
    group_size: yup.object().typeError("Select group size").required("Group size is required"),
});

const buildScores = (start, end, scores, holeProps) => {
    for(let i = start; i <= end; i++){
        scores.forEach(score => score.setHolePar(i, holeProps[i].par) );
    }
};

// after successful group change or group swap, this method updates the group of the afftected player
const updatePlayerGroupInfo = (selectedGroupPlayer, gameGroupArr, destGroupNo) => {
    const temp = [...gameGroupArr];
    const prevGroup = temp.find(arr => arr.name === selectedGroupPlayer.group);
    // remove player from previous group
    const newMembers = prevGroup.members.filter(member => member.id !== selectedGroupPlayer.id);
    prevGroup.members = newMembers;
    // add to new group
    const destinationGroup = temp.find(arr => arr.name === destGroupNo);
    destinationGroup.members.push(selectedGroupPlayer);
    // update group value in selectedPlayer
    selectedGroupPlayer.group = destGroupNo;
    return temp;
};

// after successful group change or group swap, this method updates the group property in UserScore representing the afftected player
const updateScoreInfo = (playerScores, selectedGroupPlayer, destGroupNo) => {
    const playerScore = playerScores.find(score => score.id === selectedGroupPlayer.id);
    playerScore.group = destGroupNo;
    return playerScores
};

const PlayerSelection = () => {
    const controllerRef = useRef(new AbortController());
    const { addPlayers, removePlayer, updatePlayerGroup, updateGroupSize, exchangeGroupPlayers } = useGameController();
    const { ongoingGame, holeProps, scores, setScores, groups, setGroups, setOngoingGame } = useOngoingRound();
    const game = ongoingGame();
    const gameGroupArr = groups();
    const hp = holeProps();
    const playerScores = scores();

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
        handleSubmit,
    } = useForm({ resolver: yupResolver(groupSizeSchema) });

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

    const handleSubmitUpdateGroupSize = () => {
        // if new group size is > current group size in db.... simply update
        if(sizeOfGroup > game.group_size){
            changeGroupSize();
        }
        if(sizeOfGroup < game.group_size) {
            setDisplayMsg(`Reduction in group size detected. This will remove members following the ORDER bottom up`);
            setConfirmDialogEvtName('updateGroupSize');
            setShowConfirmModal(true);
        }
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
                const leaderboardScores = [];
                for (const datum of data) {
                    gameGroupArr.forEach(g => {
                        const find = g.members.find(member => member.id === datum.id);
                        if(find){
                            toast.error(`${find.fname} ${find.lname} already added to group ${g.name}`);
                            throw new Error('Cannot add player twice');
                        }
                    })
                    arr.push(datum.id);
                    // create UserScore for each added user for leaderboards
                    const userScore = new UserScore();
                    userScore.id = datum.id;
                    userScore.hcp = datum.hcp;
                    userScore.ProfileImgKeyhash = datum.ProfileImgKeyhash;
                    userScore.name = datum.fname + ' ' + datum.lname;
                    userScore.group = activeGroup.name;
                    leaderboardScores.push(userScore);
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
                // add player(s) to selected group
                const temp = [...gameGroupArr];
                const g = temp.find(t => t.name === activeGroup.name);
                g.members.push(...data);
                // create hole scores for new added player(s) to use in leaderboards presentation
                switch (game.hole_mode) {
                    case 1:
                        buildScores(1, 18, leaderboardScores, hp);
                        break;
                    case 2:
                        buildScores(1, 9, leaderboardScores, hp);
                        break;
                    case 3:
                        buildScores(10, 18, leaderboardScores, hp);
                        break;
                }
                setScores([...playerScores, ...leaderboardScores]);
                // update group size in context game in case the user didn't click the save button for updating the group size in db before adding players to group after adjusting size
                const tempGame = {...game}
                tempGame.group_size = sizeOfGroup;
                setOngoingGame(tempGame);
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
        if(val.value !== sizeOfGroup){
            setSizeOfGroup(val.value);
        }
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

    const handleSwapPlayers = (playerToSwapWith) => {
        setSwappedPlayers([selectedGroupPlayer, playerToSwapWith]);
        setDisplayMsg(`Swap ${selectedGroupPlayer.fname} ${selectedGroupPlayer.lname} With ${playerToSwapWith.fname} ${playerToSwapWith.lname}?`);
        setConfirmDialogEvtName('swapPlayers');
        setShowConfirmModal(true);
    };
  
    const handleConfirm = async () => {
        setShowConfirmModal(false);
        switch (confirmDialogEvtName) {
            case "delGroupPlayer":
                deleteGroupPlayer();
                break;
            case "changePlayerGroup":
                changePlayerGroup();
                break;
            case "updateGroupSize":
                changeGroupSize();
                break;
            case "swapPlayers":
                swapPlayers();
                break;
        }
    };

    const changeGroupSize = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            const response = await updateGroupSize(controllerRef.current.signal, game.id, sizeOfGroup);
            // remove excess player from group if new size is smaller than previous
            const groups = [...gameGroupArr];
            if(sizeOfGroup < game.group_size){
                groups.forEach(gameGroup => {
                    if(gameGroup.members.length > sizeOfGroup){
                        const members = gameGroup.members.slice(0, sizeOfGroup);
                        gameGroup.members = members;
                    }
                });
            }
            setGroups(groups);
            // remove excess players in player scores
            const newPlayerScores = [];
            playerScores.forEach(playerScore => {
                if(!response.data.includes(playerScore.id)){
                    newPlayerScores.push(playerScore);
                }
            });
            setScores(newPlayerScores);
            // update group size in game
            const temp = {...game}
            temp.group_size = sizeOfGroup;
            setOngoingGame(temp);
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
            const groupNo = changedPlayerGroupDetails.value.name;
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
            const updatedGroups = updatePlayerGroupInfo(selectedGroupPlayer, gameGroupArr, groupNo);
            // update group of player in scores (in ongoing-game-context)
            const updatedPlayerScores = updateScoreInfo(playerScores, selectedGroupPlayer, groupNo);
            setGroups(updatedGroups);
            setScores(updatedPlayerScores);
            
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

    const swapPlayers = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            const payload = {
                game_id: game.id,
                playerOne: {
                    id: selectedGroupPlayer.id,
                    group_name: selectedGroupPlayer.group,
                },
                playerTwo: {
                    id: swappedPlayers[1].id,
                    group_name: swappedPlayers[1].group,
                }
            };
            await exchangeGroupPlayers(controllerRef.current.signal, payload);
            /*  store destinations of players before calling updatePlayerGroupInfo. As the parameters are passes by ref, the value of destination for player two would have been altered    */
            const selectedPlayerDestination = swappedPlayers[1].group;
            const swappedWithDestination = swappedPlayers[0].group;
            const tempUpdatedGroupsArr = updatePlayerGroupInfo(swappedPlayers[0], gameGroupArr, selectedPlayerDestination);
            const updatedGroupsArr = updatePlayerGroupInfo(swappedPlayers[1], tempUpdatedGroupsArr, swappedWithDestination);
            // update group of player in scores (in ongoing-game-context)
            const tempUpdatedPlayerScores = updateScoreInfo(playerScores, swappedPlayers[0], selectedPlayerDestination);
            const updatedPlayerScores = updateScoreInfo(tempUpdatedPlayerScores, swappedPlayers[1], swappedWithDestination);
            setGroups(updatedGroupsArr);
            setScores(updatedPlayerScores);
            
            setSelectedGroupPlayer(null);
            setChangedPlayerGroupDetails(null);
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
                            <div className={`d-flex gap-3 ${game?.status > 1 ? "disabledDiv" : ''}`}>
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
                                            value={value}
                                        />
                                    )}
                                />
                                <Button variant="primary" className="fw-bold col-6" onClick={handleSubmit(handleSubmitUpdateGroupSize)}>
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
                handleSwapPlayers={handleSwapPlayers}
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