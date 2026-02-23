import { Button, Form, Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from "react-select";
import {
    RiUserLine,
    RiMailLine,
} from "react-icons/ri";
import { IoPhonePortraitOutline } from "react-icons/io5";

import ErrorMessage from '../ErrorMessage';
import { ThreeDotLoading } from '../react-loading-indicators/Indicator';
import { schema } from '../../Utils/yup-schema-validator/staff-schema';
import { gender } from '../../Utils/data';

const StaffCreationDialog = ({ show, handleClose, handleConfirm, message, networkRequest, authOptions }) => {

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    
    const onSubmit = async (formData) => {
        handleConfirm(formData);
    };

    return (
        <Modal backdrop='static' show={show} onHide={handleClose}>
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
                                    placeholder="First Name"
                                    {...register("fname")}
                                />
                            </div>
                            <ErrorMessage source={errors.fname} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Last Name</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <RiUserLine size={18} />
                                </span>
                                <Form.Control
                                    type="text"
                                    placeholder="Last Name"
                                    {...register("lname")}
                                />
                            </div>
                            <ErrorMessage source={errors.lname} />
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
                                    placeholder="Phone Number"
                                    {...register("phone")}
                                />
                            </div>
                            <ErrorMessage source={errors.phone} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Gender</label>
                            <Controller
                                name="sex"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        required
                                        name="sex"
                                        placeholder="Select Item..."
                                        className="text-dark col-12"
                                        options={gender}
                                        onChange={(val) => onChange(val)}
                                        value={value}
                                    />
                                )}
                            />
                            <ErrorMessage source={errors.sex} />
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
                                    placeholder="john@example.com"
                                    {...register("email")}
                                />
                            </div>
                            <ErrorMessage source={errors.authorities} />
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
                                        options={authOptions}
                                        onChange={(val) => onChange(val)}
                                    />
                                )}
                            />
                            <ErrorMessage source={errors.authorities} />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose} disabled={networkRequest} style={{minWidth: '150px'}}>
                        {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                        {!networkRequest && 'Cancel'}
                    </Button>
                    <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={networkRequest} style={{minWidth: '150px'}}>
                        {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                        {!networkRequest && 'Create Account'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default StaffCreationDialog;