import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { BiSolidEditAlt } from "react-icons/bi";
import {
    RiUserLine,
    RiMailLine,
    RiEyeLine,
    RiLockLine,
    RiEyeOffLine,
} from "react-icons/ri";

import { useAuth } from "../../../app-context/auth-context";
import useStaffController from "../../../api-controllers/staff-controller";
import { useAuthUser } from "../../../app-context/user-context";
import useGenericController from "../../../api-controllers/generic-controller-hook";
import cryptoHelper from "../../../Utils/crypto-helper";
import handleErrMsg from "../../../Utils/error-handler";
import ErrorMessage from "../../../Components/ErrorMessage";
import { ThreeDotLoading } from "../../../Components/react-loading-indicators/Indicator";
import { emailSchema, pw_schema, otp_schema } from "../../../Utils/yup-schema-validator/user-form-schema";
import ConfirmDialog from "../../../Components/DialogBoxes/ConfirmDialog";
import StaffProfileDialog from "../../../Components/DialogBoxes/StaffProfileDialog";

const StaffProfilePage = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { updateStaffPersonalInfo, updateStaffEmail } = useAuth();
    const { updatePassword } = useStaffController();
    const { requestOTP } = useGenericController();
    const { authUser } = useAuthUser();
    const user = authUser();
    
    const [networkRequest, setNetworkRequest] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    // for courses
    const [courseOptions, setCourseOptions] = useState([]);

	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showClientProfileModal, setShowClientProfileModal] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");
    const [confirmDialogEvtName, setConfirmDialogEvtName] = useState(null);
    const [updatedPersonalInfo, setUpdatedPersonalInfo] = useState(null);
    const [pwDetails, setPwDetails] = useState(null);
    const [emailDetails, setEmailDetails] = useState(null);

    const emailRef = useRef();
    
    const {
        register: pwRegister,
        handleSubmit: pwHandleSubmit,
        formState: { errors: pw_errors },
    } = useForm({resolver: yupResolver(pw_schema)});
    
    const {
        register: otpRegister,
        handleSubmit: otpHandleSubmit,
        formState: { errors: otp_errors },
    } = useForm({resolver: yupResolver(otp_schema)});
    
    useEffect(() => {
        // cliet not allowed to view this page... clients have mode 1
        if(!user || cryptoHelper.decryptData(user.mode) === '1'){
            navigate("/");
        }

        if(user){
            // hcpSetValue('hcp', user.hcp);
            // hcSetValue('home_club', ({label: homeClub.name, value: homeClub}));
        }
        return () => {
            // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
            controllerRef.current.abort();
        };
    }, [location.pathname]);

	const handleCloseProfileModal = () => {
        setShowClientProfileModal(false);
    };

	const handleCloseModal = () => {
        setShowConfirmModal(false);
    };
  
    const handleConfirm = async () => {
        setShowConfirmModal(false);
        switch (confirmDialogEvtName) {
            case "personalInfo":
                savePersonalInfo();
                break;
            case "pw":
                updatePass();
                break;
            case "email":
                updateMail();
                break;
        }
    };

    const updateInfo = async (data) => {
        setUpdatedPersonalInfo(data);
        setDisplayMsg("Update personal information?");
        setConfirmDialogEvtName('personalInfo');
        setShowConfirmModal(true);
    };

    const handlePasswordUpdate = async (data) => {
        setPwDetails(data);
        setDisplayMsg(`Update Password?`);
        setConfirmDialogEvtName('pw');
        setShowConfirmModal(true);
    };

    const handleEmailUpdate = async (data) => {
        setEmailDetails(data);
        setDisplayMsg(`Update Email?`);
        setConfirmDialogEvtName('email');
        setShowConfirmModal(true);
    };

    const verifyEmail = async () => {
        // validate email
        try {
            setNetworkRequest(true);
            emailSchema.validateSync(emailRef.current.value);
			toast.info(`sending OTP to ${emailRef.current.value}.`);
            resetAbortController();
            await requestOTP(emailRef.current.value, controllerRef.current.signal);
			toast.info(`OTP sent to ${emailRef.current.email}. If not found in your inbox, please check you spam`);
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

    const savePersonalInfo = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            const temp = {
                phone: updatedPersonalInfo.phone,
                fname: updatedPersonalInfo.fname,
                lname: updatedPersonalInfo.lname,
                sex: updatedPersonalInfo.sex.value
            }
            await updateStaffPersonalInfo(controllerRef.current.signal, temp);
            setUpdatedPersonalInfo(null);
            setShowClientProfileModal(false);
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

    const updatePass = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            await updatePassword(controllerRef.current.signal, {current_pw: cryptoHelper.encrypt(pwDetails.current_pw), pw: cryptoHelper.encrypt(pwDetails.pw)});
            toast.info('Password update successful');
            setPwDetails(null);
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

    const updateMail = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            await updateStaffEmail(controllerRef.current.signal, {otp: emailDetails.otp, email: emailRef.current.value});
            setNetworkRequest(false);
            toast.info("Email update successful");
            setEmailDetails(null);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const resetAbortController = () => {
        // Cancel previous request if it exists
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
    };

    return (
        <section className='container' style={{minHeight: '60vh'}}>
            <Row className="mt-5 ms-2">
                <h2>Edit Profile</h2>
            </Row>
            <Row className="mt-3 shadow border-0 rounded-3 p-1">
                <div className="d-flex justify-content-between p-3">
                    <h4 className="fw-bold">Personal Info</h4>
                    <span className="fw-bold h4 text-danger btn" onClick={() => setShowClientProfileModal(true)}>
                        <BiSolidEditAlt color="red" /> Edit
                    </span>
                </div>
                <Col xs={12} md={3} sm={12} className="mb-2 my-2 g-3 ps-3">
                    <label className="form-label">First Name</label>
                    <div className="input-group d-flex gap-2 align-items-center">
                        <label className="h5">{user?.firstName}</label>
                    </div>
                </Col>
                <Col xs={12} md={3} sm={12} className="mb-2 my-2 g-3 ps-3">
                    <label className="form-label">Last Name</label>
                    <div className="input-group d-flex gap-2 align-items-center">
                        <label className="h5">{user?.lastName}</label>
                    </div>
                </Col>
                <Col xs={12} md={3} sm={12} className="mb-2 my-2 g-3 ps-3">
                    <label className="form-label">Phone</label>
                    <div className="input-group d-flex gap-2 align-items-center">
                        <label className="h5">{user?.phone}</label>
                    </div>
                </Col>
                <Col xs={12} md={3} sm={12} className="mb-2 my-2 g-3 ps-3">
                    <label className="form-label">Gender</label>
                    <div className="input-group d-flex gap-2 align-items-center">
                        <label className="h5">{user?.sex === 'M' ? "Male" : 'Female'}</label>
                    </div>
                </Col>
            </Row>

            <Row className="mt-4 shadow border-0 rounded-3 h-100 p-1 mb-5">
                <div className="d-flex justify-content-between p-3">
                    <h4 className="fw-bold">Account</h4>
                </div>
                <Col xs={12} md={6} sm={12} className="mb-3">

                    <div className="d-flex flex-column mb-4">
                        <div className="row g-3">
                            <div className="col-md-8">
                                <label className="form-label">Current Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">
                                        <RiLockLine size={18} />
                                    </span>
                                    <Form.Control
                                        type={showOldPassword ? "text" : "password"}
                                        placeholder="Enter Current password"
                                        {...pwRegister("current_pw")} 
                                    />
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowOldPassword(!showOldPassword)} >
                                        {showOldPassword ? (
                                            <RiEyeOffLine size={18} />
                                        ) : (
                                            <RiEyeLine size={18} />
                                        )}
                                    </button>
                                </div>
                                <ErrorMessage source={pw_errors.current_pw} />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-column mb-4">
                        <div className="row g-3">
                            <div className="col-md-8">
                                <label className="form-label">New Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">
                                        <RiLockLine size={18} />
                                    </span>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create new password"
                                        {...pwRegister("pw")}
                                    />
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)} >
                                        {showPassword ? (
                                            <RiEyeOffLine size={18} />
                                        ) : (
                                            <RiEyeLine size={18} />
                                        )}
                                    </button>
                                </div>
                                <ErrorMessage source={pw_errors.pw} />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-column mb-4">
                        <div className="row g-3">
                            <div className="col-md-8">
                                <label className="form-label">Confirm New Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">
                                        <RiLockLine size={18} />
                                    </span>
                                    <Form.Control
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        {...pwRegister("confirm_pw")}
                                    />
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword) }>
                                        {showConfirmPassword ? (
                                            <RiEyeOffLine size={18} />
                                        ) : (
                                            <RiEyeLine size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-4 d-flex align-items-end justify-content-end">
                                <Button type="button" className="btn btn-success w-100 fw-bold custom-btn" onClick={pwHandleSubmit(handlePasswordUpdate)} disabled={networkRequest}>
                                    {!networkRequest && <span> Change Password</span>}
                                    {networkRequest && <ThreeDotLoading color="#ffffff" size="small" />}
                                </Button>
                            </div>
                            <ErrorMessage source={pw_errors.confirm_pw} />
                        </div>
                    </div>
                </Col>

                <Col xs={12} md={6} sm={12} className="mb-3">
                    <div className="mb-4 d-flex flex-column gap-2">
                        <label className="form-label">Current Email</label>
                        <div className="input-group d-flex gap-2 align-items-center">
                            <label className="h5">{user?.email}</label>
                        </div>
                    </div>

                    <div className="d-flex flex-column mb-4">
                        <div className="row g-3">
                            <div className="col-md-8">
                                <label className="form-label fw-bold">New Email</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">
                                        <RiMailLine size={18} />
                                    </span>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="form-control"
                                        ref={emailRef}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 d-flex align-items-end justify-content-end">
                                <Button type="button" className="btn btn-success w-100 fw-bold" onClick={() => verifyEmail()} disabled={networkRequest}>
                                    {!networkRequest && <span><IoShieldCheckmarkSharp className="me-2" /> Verify</span>}
                                    {networkRequest && <ThreeDotLoading color="#ffffff" size="small" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-column mb-4">
                        <div className="row g-3">
                            <div className="col-md-8">
                                <label className="form-label fw-bold">OTP</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">
                                        <RiUserLine size={18} />
                                    </span>
                                    <Form.Control
                                        type="text"
                                        placeholder="enter otp sent to email for verification"
                                        {...otpRegister("otp")}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 d-flex align-items-end justify-content-end">
                                <Button type="button" className="btn btn-success w-100 fw-bold custom-btn" onClick={otpHandleSubmit(handleEmailUpdate)}>
                                    {!networkRequest && <span><RiMailLine className="me-2" /> Update Email</span>}
                                    {networkRequest && <ThreeDotLoading color="#ffffff" size="small" />}
                                </Button>
                            </div>
                        </div>
                        <ErrorMessage source={otp_errors.otp} />
                    </div>
                </Col>
            </Row>
			<ConfirmDialog
				show={showConfirmModal}
				handleClose={handleCloseModal}
				handleConfirm={handleConfirm}
				message={displayMsg}
			/>
			<StaffProfileDialog
				show={showClientProfileModal}
				handleClose={handleCloseProfileModal}
				handleConfirm={updateInfo}
				networkRequest={networkRequest}
			/>
        </section>
    )
}

export default StaffProfilePage;