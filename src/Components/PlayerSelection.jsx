import { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { IoMdAddCircle } from "react-icons/io";
import Select from 'react-select';
import { Controller, useForm } from 'react-hook-form';

import { useAuthUser } from '../app-context/user-context';
import IMAGES from '../assets/images';
import { groupSizeOptions } from '../Utils/data';
import ImageComponent from './ImageComponent';

const PlayerSelection = ({gameGroupArr = [], groupSize = 4}) => {
    const { authUser } = useAuthUser();
    const user = authUser();

    // const [players, setPlayers] = useState([user, null, null, null]); // 4 slots
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [players, setPlayers] = useState([]);
    const [sizeOfGroup, setSizeOfGroup] = useState(groupSize);
    const [groupArr, setGroupArr] = useState(gameGroupArr);
    
    const {
        control,
        setValue,
    } = useForm({});

    const registeredPlayers = [
        {
            name: "Obarinsola Olatunji",
            image: IMAGES.player1,
            handicap: "+2",
            tee: "60",
        },
        {
            name: "Olumide Olumide",
            image: IMAGES.player2,
            handicap: "0",
            tee: "58",
        },
        { name: "Joshua Josh", image: IMAGES.player3, handicap: "+1", tee: "59" },
        { name: "Charles Bob", image: IMAGES.player4, handicap: "-1", tee: "61" },
        { name: "Henry Danger", image: IMAGES.player5, handicap: "+3", tee: "62" },
        {
            name: "Jesse Lee Peterson",
            image: IMAGES.player6,
            handicap: "+4",
            tee: "57",
        },
    ];

    useEffect(() => {
        const defaultGroupSize = groupSizeOptions.find(a => a.value === sizeOfGroup );
        setValue('group_size', defaultGroupSize);
    }, [groupArr, sizeOfGroup]);

    // const selectPlayerForSlot = (slotIdx, playerObj) => {
    //     setPlayers((prev) => {
    //         const copy = [...prev];
    //         copy[slotIdx] = playerObj;
    //         return copy;
    //     });
    // };

    const handlePlayerButton = (data) => {
        console.log(data);
    };

    const handleAddGroup = () => {
        const temp = {
            name: groupArr.length + 1,
            members: []
        };
        setGroupArr([...groupArr, temp]);
    };

    const handleGroupSizeChanged = (val) => {
        setSizeOfGroup(val.value);
    };

    const buildGroup = (datum, idx) => {
        // console.log(datum);
        return <div className='col-md-4 col-sm-12 mb-3'>
            <div className='card border-0 rounded-4 bg-light shadow'>
                <div className='d-flex flex-wrap p-2'>
                    {new Array(sizeOfGroup).fill(1).map((val, index) => {
                        if(datum.members[index]){
                            return <div className='p-1 w-50 d-flex gap-2 align-items-center mb-1 mt-1 text-start' key={index} onClick={() => handlePlayerButton(datum)}>
                                {datum.members[index].ClientImgBlurhash && <ImageComponent image={datum.members[index].ClientImgBlurhash} width={'30px'} height={'30px'} round={true} />}
                                {!datum.members[index].ClientImgBlurhash && <img src={IMAGES.svg_user} width={'30px'} height={'30px'} className='rounded-circle' />}
                                <span className='d-flex flex-column align-items-start gap-1'>
                                    <span className='fw-bold' style={{fontSize: '12px'}}> {datum.members[index]?.fname} {datum.members[index]?.lname} </span>
                                    <div> HCP: <span className='fw-bold'>{datum.members[index]?.hcp}</span> </div>
                                </span>
                            </div>
                        }else {
                            return <span className='p-1 w-50 mb-1 mt-1'>
                                <Button variant="success" className="fw-bold w-100" onClick={() => handlePlayerButton()} key={index}>
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

    const buildPlayerGroups = groupArr.map((datum, i) => { return buildGroup(datum, i) });

    return (
        <div className="mb-5">
            <div className="text-center container">
                <div className='row'>
                    <div className="col-sm-12 col-md-4 mb-3 d-flex gap-3 align-items-center justify-content-center">
                        <Button variant="success" className="fw-bold col-12 col-md-6" onClick={handleAddGroup}>
                            <IoMdAddCircle size='32px' /> Add
                        </Button>
                    </div>
                    <h2 className="mb-3 col-12 col-md-4">Players</h2>
                    <div className="d-flex gap-4 align-items-center justify-content-center col-12 col-md-4 mb-3">
                        <div className="d-flex flex-column w-100 gap-2">
                            <span className="align-self-start fw-bold">Group Size</span>
                            <Controller
                                name="group_size"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        required
                                        name="filter"
                                        placeholder="Filter..."
                                        className="text-dark col-12 col-md-5"
                                        defaultValue={groupSizeOptions[2]}
                                        options={groupSizeOptions}
                                        onChange={(val) => { handleGroupSizeChanged(val) }}
                                        value={value}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* PLAYER GRID */}
                <div className="mb-4 row">
                    {buildPlayerGroups}

                    <div className="player-grid"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                            gap: "1rem",
                        }}
                    >
                        {players.map((player, idx) => (
                            <div key={idx}
                                className="position-relative p-3 border rounded bg-white d-flex flex-column align-items-center justify-content-center shadow-sm"
                                style={{
                                    minHeight: "150px",
                                    cursor: idx === 0 ? "default" : "pointer",
                                }}
                                onClick={() => {
                                    if (idx !== 0) {
                                        setSelectedSlot(idx);
                                        setShowModal(true);
                                    }
                                }}
                            >
                                {/* Unselect button (except maybe prevent unselecting host without confirmation) */}
                                {player && idx !== 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            unselectPlayer(idx);
                                        }}
                                        className="btn btn-sm btn-outline-danger position-absolute"
                                        style={{ top: 8, right: 8 }}
                                    >
                                        Remove
                                    </button>
                                )}

                                {player ? (
                                    <>
                                        <img
                                            src={player.image}
                                            alt={player.name}
                                            style={{
                                                width: "60px",
                                                height: "60px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                marginBottom: "0.5rem",
                                            }}
                                        />
                                        <h6 className="fw-bold">{player.name}</h6>
                                        <small className="text-muted">
                                            HC: {player.handicap} | Tee: {player.tee}
                                        </small>
                                    </>
                                ) : (
                                    <div className="text-center text-muted">
                                        <div
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                borderRadius: "50%",
                                                background: "#e9ecef",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "24px",
                                                margin: "0 auto 0.5rem",
                                            }}
                                        >
                                            +
                                        </div>
                                        <span>Add Player</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* PLAYER SELECTION MODAL */}
            <Modal show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setSelectedSlot(null);
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Select a Player</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column gap-2">
                        {registeredPlayers.map((rp, i) => {
                            const alreadyPicked = players.some((p) => p && p.name === rp.name);
                            return (
                                <div key={i}
                                    className={`p-3 border rounded d-flex align-items-center shadow-sm ${alreadyPicked? "bg-dark-subtle text-muted" : "hover-bg-light"}`}
                                    style={{ cursor: alreadyPicked ? "not-allowed" : "pointer",}}
                                    onClick={() => {
                                        if (selectedSlot === null || alreadyPicked) return;
                                        selectPlayerForSlot(selectedSlot, rp);
                                        setShowModal(false);
                                        setSelectedSlot(null);
                                    }}
                                >
                                    <img src={rp.image} alt={rp.name}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            marginRight: "1rem",
                                            opacity: alreadyPicked ? 0.5 : 1,
                                        }}
                                    />
                                    <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-0">{rp.name}</h6>
                                        <small className="text-muted">
                                            HC: {rp.handicap} | Tee: {rp.tee}
                                        </small>
                                    </div>
                                    {alreadyPicked && (
                                        <span className="badge bg-success" style={{ fontSize: 12 }}>
                                            ✓ Selected
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default PlayerSelection;