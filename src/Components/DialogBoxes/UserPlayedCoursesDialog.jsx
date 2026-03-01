import { useRef, useState } from 'react'
import { Modal, Loader } from 'rsuite';
import { toast } from 'react-toastify';

import useUserController from '../../api-controllers/user-controller-hook';
import handleErrMsg from '../../Utils/error-handler';

const UserPlayedCoursesDialog = ({ show, handleClose, user_id}) => {

    const controllerRef = useRef(new AbortController());
    const [networkRequest, setNetworkRequest] = useState(true);
    const [courses, setCourses] = useState([]);

    const { playedCourses } = useUserController();

    const handleEntered = async () => {
        try {
            const response = await playedCourses(controllerRef.current.signal, user_id);
            setCourses(response.data);
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

    const buildCourseCard = (datum, idx) => {
        return <div key={idx} className={`p-3 border d-flex flex-column rounded d-flex shadow-sm mt-3 w-100`} >
            <h6 className="fw-bold mb-0 text-success">{datum.name}</h6>
            <h6 className="fw-bold mb-0">{datum.location}</h6>
            <small className='fs-6'>
                Holes: {datum.no_of_holes} | PAR: {datum.par}
            </small>
        </div>
    };

    const buildCoursesCard = courses.map((datum, idx) => buildCourseCard(datum, idx) );

    return (
        <Modal
            backdrop={'static'}
            overflow={true}
            open={show}
            onClose={handleClose}
            onEntered={handleEntered}
            onExited={() => {
                setCourses([]);
                setNetworkRequest(true);
            }}
        >
            <Modal.Header>
                <Modal.Title>Courses Played</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!networkRequest && buildCoursesCard }
                {networkRequest && <div style={{ textAlign: 'center' }}>
                    <Loader size="md" />
                </div>}
            </Modal.Body>
        </Modal>
    )
}

export default UserPlayedCoursesDialog;