import { useEffect, useRef, useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';

import { useAuthUser } from '../../../app-context/user-context';
import cryptoHelper from '../../../Utils/crypto-helper';
import handleErrMsg from '../../../Utils/error-handler';
import useGenericController from '../../../api-controllers/generic-controller-hook';
import useStaffController from '../../../api-controllers/staff-controller-hook';
import { ThreeDotLoading } from '../../../Components/react-loading-indicators/Indicator';
import ConfirmDialog from '../../../Components/DialogBoxes/ConfirmDialog';

import editorSchema from "../../../Utils/quill-schema";
import Editor from "../../../Components/quill/quill-editor";
import Quill from 'quill';
import Ajv from "ajv";

const Delta = Quill.import('delta');

const TermsAndAgreementReview = () => {
    const ajv = new Ajv({allErrors: true}); // options can be passed, e.g. {allErrors: true}
    const controllerRef = useRef(new AbortController());

    const { performGetRequests } = useGenericController();
    const { updateTermsAndAgreement } = useStaffController();
    const { authUser } = useAuthUser();
    const user = authUser();
    
    const navigate = useNavigate();
    const location = useLocation();
    
	// Use a ref to access the quill instance directly
	const quillRef = useRef();
    const [networkRequest, setNetworkRequest] = useState(true);
	const [termsAndAgreeement, setTermsAndAgreement] = useState({});
    
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");

    useEffect(() => {
        if(!user || cryptoHelper.decryptData(user.mode) !== '0'){
            navigate("/dashboard");
            return;
        }

        initialize();
        return () => {
            // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
            controllerRef.current.abort();
        };
    }, [location.pathname]);

    const initialize = async () => {
        try {
            controllerRef.current = new AbortController();
            setNetworkRequest(true);
            const urls = [ '/terms/get'];
            const response = await performGetRequests(urls);
            const { 0: terms } = response;

            //  check if the request to fetch locations doesn't fail before setting values to display
            if(terms && terms.data){
                setNetworkRequest(false);
                setTermsAndAgreement(terms.data);
                // TODO: use parse when going live/production mode
                // const quillData = JSON.parse(terms.data.value);
                const quillData = terms.data.value;
                let content = new Delta();
                quillData.forEach(element => {
                    content.insert(element.insert, element.attributes)
                });
                quillRef.current.setContents(content);
            }
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

    const handleOpenModal = () => {
        setDisplayMsg("Update Terms and Conditions");
        setShowConfirmModal(true);
    };
  
    const handleConfirm = async () => {
        setShowConfirmModal(false);
        try {
            setNetworkRequest(true);
            const { ops } = quillRef.current.getContents();
            const isValid = ajv.validate(editorSchema, ops);
            if (!isValid) {
                toast.error("Please enter/edit Terms and Conditions");
            }else {
			    await updateTermsAndAgreement(controllerRef.current.signal, ops);
            }
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

    return (
        <div className="container mt-4" style={{minHeight: '60vh'}}>
            <div className="mb-4" id="head">
                <h2 className='text-primary'>
                    Terms <span className='text-danger'> and  </span>Agreement
                </h2>
                <div className="d-flex gap-3 align-items-center text-muted">
                    Last Updated: 
                    { termsAndAgreeement?.value && <small className="">{formatDistanceToNow(termsAndAgreeement.updatedAt, {addSuffix: true})}</small>}
                </div>
            </div>
            <hr />
            <div id="body" className="mb-3">
                <Editor ref={quillRef} />
            </div>
            <Button variant="" className="btn-outline-primary mb-5" onClick={() => handleOpenModal()} disabled={networkRequest}>
                Update
                { networkRequest && <ThreeDotLoading color="#ffffff" size="small" variant = "pulsate" />}
            </Button>
            <ConfirmDialog show={showConfirmModal} handleClose={() => setShowConfirmModal(false)} handleConfirm={handleConfirm} message={displayMsg} />
        </div>
    )
}

export default TermsAndAgreementReview;