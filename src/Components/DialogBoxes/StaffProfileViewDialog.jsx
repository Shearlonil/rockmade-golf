import { useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
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

    const { findByIdWithAuths } = useStaffController();

    const {
        handleSubmit,
        register,
        control,
        setValue,
        formState: { errors },
    } = useForm();
    
    const onSubmit = async (formData) => {
        handleConfirm(formData.authorities);
    };

    const modalLoaded = async () => {
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
                const response = await findByIdWithAuths(controllerRef.current.signal, staff.id);
                const arr = [];
                response.data.Authorities?.forEach(auth => {
                    const a = authOptions.find(option => option.value.id === auth.id);
                    arr.push(a);
                });
                setValue('authorities', arr);
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
        setValue('authorities', null);
        // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
        controllerRef.current.abort();
    };

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
                                        isMulti
                                        name="authorities"
                                        placeholder="Select Authorities..."
                                        className="text-dark col-12"
                                        isLoading={authsLoading}
                                        options={authOptions}
                                        onChange={(val) => onChange(val)}
                                        value={value}
                                    />
                                )}
                            />
                            <ErrorMessage source={errors.authorities} />
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