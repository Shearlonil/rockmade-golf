import { useRef, useState } from 'react';
import { Button, Form, Modal, CloseButton } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import Select from "react-select";
import {
    RiUserLine,
    RiMailLine,
} from "react-icons/ri";
import { toast } from 'react-toastify';
import { IoPhonePortraitOutline } from "react-icons/io5";

import ErrorMessage from '../ErrorMessage';
import { ThreeDotLoading } from '../react-loading-indicators/Indicator';
import useStaffController from '../../api-controllers/staff-controller';
import handleErrMsg from '../../Utils/error-handler';

const StaffProfileViewDialog = ({ show, handleClose, handleConfirm, message, networkRequest, authOptions, staff }) => {

    const controllerRef = useRef(new AbortController());
    const [authsLoading, setAuthsLoading] = useState(false);
    const [allowedAuths, setAllowedAuths] = useState([]);
    const [selectOptions, setSelectOptions] = useState([]);

    const { findByIdWithAuths } = useStaffController();

    const {
        handleSubmit,
        register,
        control,
        setValue,
        formState: { errors },
    } = useForm();
    
    const onSubmit = () => {
        handleConfirm(allowedAuths);
    };

    const modalLoaded = async () => {
        // console.log(authOptions);
        try {
            //	check if the request to fetch authorities doesn't fail before setting values to display
            if(staff){
                setValue('fname', staff.fname);
                setValue('lname', staff.lname);
                setValue('phone', staff.phone);
                setValue('sex', staff.sex === 'M' ? 'Male' : "Female");
                setValue('email', staff.email);
                setValue('creator', staff.creator_fname + " " + staff.creator_lname);
				setAuthsLoading(true);
                controllerRef.current = new AbortController();
                const decrypted_id = cryptoHelper.decryptData(editedUser.id);
                const response = await findByIdWithAuths(controllerRef.current.signal, decrypted_id);
                const arr = [];
                const options = []; // options for select
                authOptions.forEach(authOption => {
                    const found = response.data.Authorities?.find(a => authOption.value.id === a.id);
                    if(found){
                        arr.push(authOption.value);
                    }else {
                        options.push(authOption);
                    }
                })
                setAllowedAuths(arr);
                setSelectOptions(options);
				setAuthsLoading(false);
            }
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setAuthsLoading(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const handleModalExited = async () => {
        // reset all fields on unmount
        setValue('fname', '');
        setValue('lname', '');
        setValue('phone', '');
        setValue('sex', '');
        setValue('email', '');
        setValue('creator', "");
        // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
        controllerRef.current.abort();
    };

    const removeAuth = (auth) => {
        const temp = [...allowedAuths];
        const filtered = temp.filter(allowed => allowed.id !== auth.id);
        setAllowedAuths(filtered);
        // add back to options for react-select
        const options = [...selectOptions];
        // check if already added back to options
        const found = options.find(option => option.value.id === auth.id);
        if(!found){
            options.push({label: auth.name, value: auth});
            setSelectOptions(options);
        }
    };

    const handleOptionChange = (auth) => {
        if(auth){
            const temp = [...allowedAuths];
            // find if already exists in allowed auth
            const found = temp.find(a => a.id === auth.value.id);
            if(!found){
                temp.push(auth.value);
                setAllowedAuths(temp);
            }
            setValue('authorities', null);
        }
    };

    const buildAuthBadges = allowedAuths.map((auth, index) => (
        <div key={index}  className={`bg-success-subtle text-dark rounded-1 p-1 d-flex align-items-center justify-content-between`} >
            <small className="pe-0 me-2 m-0">{auth.name}</small>
            <CloseButton className="p-0 fw-bold" onClick={() => removeAuth(auth)} aria-label="Hide" />
        </div>
    ));

    return (
        <Modal show={show} onHide={handleClose} onEntered={modalLoaded} onExited={handleModalExited}>
            <Modal.Header closeButton>
                <Modal.Title>{message}</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">First Name</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <RiUserLine size={18} />
                                </span>
                                <Form.Control
                                    type="text"
                                    disabled
                                    {...register("fname")}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Last Name</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <RiUserLine size={18} />
                                </span>
                                <Form.Control
                                    type="text"
                                    disabled
                                    {...register("lname")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">
                                Phone Number
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <IoPhonePortraitOutline size={18} />
                                </span>
                                <Form.Control
                                    type="number"
                                    disabled
                                    {...register("phone")}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Gender</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <RiUserLine size={18} />
                                </span>
                                <Form.Control
                                    type="text"
                                    disabled
                                    {...register("sex")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-12">
                            <label className="form-label fw-bold">
                                Email
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <RiMailLine size={18} />
                                </span>
                                <Form.Control
                                    type="text"
                                    disabled
                                    {...register("email")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-12">
                            <label className="form-label fw-bold">
                                Creator
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <RiUserLine size={18} />
                                </span>
                                <Form.Control
                                    type="text"
                                    disabled
                                    {...register("creator")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-12">
                            <label className="form-label fw-bold">Authorities</label>
                            <Controller
                                name="authorities"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        isClearable
                                        name="authorities"
                                        placeholder="Select Authorities..."
                                        className="text-dark col-12"
                                        isLoading={authsLoading}
                                        options={selectOptions}
                                        onChange={(val) => {
                                            handleOptionChange(val);
                                            onChange(val);
                                        }}
                                        value={value}
                                    />
                                )}
                            />
                            <ErrorMessage source={errors.authorities} />
                        </div>
                        <div className='d-flex flex-wrap gap-2'>
                            {allowedAuths.length > 0 && buildAuthBadges}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose} disabled={networkRequest}>
                        {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                        {!networkRequest && 'Cancel'}
                    </Button>
                    <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={networkRequest}>
                        {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                        {!networkRequest && 'Confirm'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default StaffProfileViewDialog;