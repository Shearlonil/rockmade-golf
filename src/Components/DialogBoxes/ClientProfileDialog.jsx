import { Button, Form, Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from "react-select";
import { RiUserLine, } from "react-icons/ri";
import Datetime from "react-datetime";

import ErrorMessage from '../ErrorMessage';
import { ThreeDotLoading } from '../react-loading-indicators/Indicator';
import { personal_info_schema } from '../../Utils/yup-schema-validator/user-form-schema';
import { gender } from '../../Utils/data';
import { useAuthUser } from '../../app-context/user-context';

const ClientProfileDialog = ({ show, handleClose, handleConfirm, networkRequest }) => {
    const { authUser } = useAuthUser();
    const user = authUser();

    const {
        handleSubmit,
        register,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(personal_info_schema),
    });

    const modalLoaded = () => {
        if(user){
            setValue('fname', user.firstName);
            setValue('lname', user.lastName);
            setValue('dob', user.dob);
            const sex = gender.find(g => g.value.toLowerCase() === user.sex.toLowerCase());
            setValue("sex", sex);
        }
    };
    
    const onSubmit = async (formData) => {
        handleConfirm(formData);
    };

    return (
        <Modal show={show} onHide={handleClose} onEntered={modalLoaded}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
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
                                Date Of Birth
                            </label>
                            <Controller
                                name="dob"
                                control={control}
                                render={({ field }) => (
                                    <Datetime
                                        {...field}
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        dateFormat="DD/MM/YYYY"
                                        inputProps={{
                                            placeholder: "Date of Birth",
                                            className: "form-control",
                                            readOnly: true, // Optional: makes input read-only
                                        }}
                                        value={field.value ? new Date(field.value) : null}
                                        onChange={(date) => field.onChange(date ? date.toDate() : null)}
                                        /*	react-hook-form is unable to reset the value in the Datetime component because of the below bug.
                                            refs:
                                                *	https://stackoverflow.com/questions/46053202/how-to-clear-the-value-entered-in-react-datetime
                                                *	https://stackoverflow.com/questions/69536272/reactjs-clear-date-input-after-clicking-clear-button
                                            there's clearly a rendering bug in component if you try to pass a null or empty value in controlled component mode: 
                                            the internal input still got the former value entered with the calendar (uncontrolled ?) despite the fact that that.state.value
                                            or field.value is null : I've been able to "patch" it with the renderInput prop :*/
                                        renderInput={(props) => {
                                            return <input {...props} value={field.value ? props.value : ''} />
                                        }}
                                    />
                                )}
                            />
                            <ErrorMessage source={errors.dob} />
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose} disabled={networkRequest} style={{minWidth: '150px'}}>
                        {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                        {!networkRequest && 'Cancel'}
                    </Button>
                    <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={networkRequest} style={{minWidth: '150px'}}>
                        {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                        {!networkRequest && 'Update Profile'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default ClientProfileDialog;