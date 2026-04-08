import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

import useGenericController from "../api-controllers/generic-controller-hook";
import { ThreeDotLoading } from "../Components/react-loading-indicators/Indicator";
import handleErrMsg from "../Utils/error-handler";

import Editor from "../Components/quill/quill-editor";
import Quill from 'quill';

const Delta = Quill.import('delta');

const TermsAndAgreement = () => {
	// Use a ref to access the quill instance directly
	const quillRef = useRef();

    const { performGetRequests } = useGenericController();

    const [networkRequest, setNetworkRequest] = useState(true);
	const [termsAndAgreeement, setTermsAndAgreement] = useState({});

    useEffect( () => {
        initialize();
    }, []);

    const initialize = async () => {
        try {
            setNetworkRequest(true);
            const urls = [ '/terms/get'];
            const response = await performGetRequests(urls);
            const { 0: terms } = response;

            //  check if the request to fetch locations doesn't fail before setting values to display
            if(terms && terms.data){
                setNetworkRequest(false);
                setTermsAndAgreement(terms.data);
                // TODO: use parse when going live/production mode
                const quillData = terms.data.value;
                // const quillData = JSON.parse(terms.data.value);
                let content = new Delta();
                quillData.forEach(element => {
                    content.insert(element.insert, element.attributes)
                });
                quillRef.current.setContents(content);
            }
            setNetworkRequest(false);
        } catch (error) {
            toast.error(handleErrMsg(error).msg);
            setNetworkRequest(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="mb-4" id="head">
                <h2>
                    Terms <span className='text-danger'> and  </span>Agreement
                </h2>
                <div className="d-flex gap-3 align-items-center text-muted">
                    Last Revised: 
                    { termsAndAgreeement?.value && <small className="">{formatDistanceToNow(termsAndAgreeement.updatedAt, {addSuffix: true})}</small>}
                </div>
            </div>
            <hr />
            <div id="body" className="mb-3">
                {networkRequest && <ThreeDotLoading color="#ffffff" size="small" variant = "pulsate" />}
                <Editor ref={quillRef} withToolBar={false} readOnly={true} />
            </div>
        </div>
    )
}

export default TermsAndAgreement;