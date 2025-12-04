import { useState } from "react";
import { Modal, Button, Accordion } from "react-bootstrap";
import { toast } from "react-toastify";

const HolesContestsDialog = ({ show, handleClose, updateHolesContest, data }) => {
    const [holesContestData, setHolesContestData] = useState([]);

    const modalLoaded = () => {
		setHolesContestData([...data]);
    };

    const minimizeModal = () => {
        updateHolesContest(holesContestData);
        handleClose();
    }

    const holeClicked = (hole, contest) => {
        const arr = [...holesContestData];
        const c = arr.find(temp => temp.id === contest.id);
        if(c) {
            // was hole previously selected
            const idx = c.selectedHoles.indexOf(hole.holeNo);
            if(idx > -1){
                // hole was previously selected. Now deselect and set canPick for same hole in other contests to true
                c.selectedHoles.splice(idx, 1);
                arr.filter(tempContest => tempContest.id !== contest.id).forEach(tempContest => {
                    const tempArr = tempContest.holes.filter(h => h.holeNo === hole.holeNo);
                    if(tempArr.length > 0){
                        tempArr[0].canPick = true
                    }
                });
            }else {
                // hole newly selected. Add to list and set canPick for same hole in other contests to false
                c.selectedHoles.push(hole.holeNo);
                arr.filter(tempContest => tempContest.id !== contest.id).forEach(tempContest => {
                    const tempArr = tempContest.holes.filter(h => h.holeNo === hole.holeNo);
                    if(tempArr.length > 0){
                        tempArr[0].canPick = false
                    }
                });
            }
            setHolesContestData(arr);
        }else {
            toast.error("An unexpected error occured. Can't update holes. Please refresh page");
        }
    }

	const buildAccordionItem = (contest, i) => {
        return <Accordion.Item eventKey={i} key={i}>
            <Accordion.Header>
                <div className="d-flex flex-column">
                    <span className="mb-2 h5">
                        {contest.name}
                    </span>
                    <span className="text-danger h6">{contest.selectedHoles.join(", ")}</span>
                </div>
            </Accordion.Header>
            <Accordion.Body className="d-flex flex-wrap gap-3">
                {
                    contest.holes.map(
                        (hole, index) => 
                            <Button variant="outline-danger" disabled={!hole.canPick} key={index}  onClick={() => holeClicked(hole, contest)} style={{minWidth: '45px'}}
                                    className={`shadow ${contest.selectedHoles.includes(hole.holeNo) ? 'bg-danger text-white' : ''} ${!hole.canPick ? 'bg-danger-subtle text-dark' : ''}`}>
                                {hole.holeNo}
                            </Button>
                    )
                } 
            </Accordion.Body>
        </Accordion.Item>
    }

    const buildAccordion = data.map((datum, i) => { return buildAccordionItem(datum, i) });

    return (
        <Modal show={show} onHide={minimizeModal} onEntered={modalLoaded}>
            <Modal.Header closeButton className="d-flex flex-column fw-bold">
                <Modal.Title className="text-danger fw-bold">CONTESTS</Modal.Title>
                <span>Add Contest to spice up your game</span>
            </Modal.Header>
            <Modal.Body>
                <Accordion defaultActiveKey={['0']} alwaysOpen>
                    {data && data.length > 0 && buildAccordion}
                </Accordion>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary w-25" onClick={minimizeModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default HolesContestsDialog;