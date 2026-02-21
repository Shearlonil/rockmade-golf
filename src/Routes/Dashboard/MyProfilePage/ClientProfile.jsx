import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import AsyncSelect from 'react-select/async';
import { yupResolver } from "@hookform/resolvers/yup";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { BiSolidEditAlt } from "react-icons/bi";
import {
    RiUserLine,
    RiMailLine,
    RiBuildingLine,
    RiGolfBallLine,
    RiEyeLine,
    RiLockLine,
    RiEyeOffLine,
} from "react-icons/ri";

import IMAGES from "../../../assets/images";
import ImageComponent from "../../../Components/ImageComponent";
import cryptoHelper from "../../../Utils/crypto-helper";
import useCourseController from "../../../api-controllers/course-controller-hook";
import handleErrMsg from "../../../Utils/error-handler";
import ErrorMessage from "../../../Components/ErrorMessage";
import { ThreeDotLoading } from "../../../Components/react-loading-indicators/Indicator";
import { emailSchema, pw_schema, otp_schema, hcp_schema } from "../../../Utils/yup-schema-validator/user-form-schema";
import ConfirmDialog from "../../../Components/DialogBoxes/ConfirmDialog";
import ClientProfileDialog from "../../../Components/DialogBoxes/ClientProfileDialog";
import { useAuth } from "../../../app-context/auth-context";
import { useAuthUser } from "../../../app-context/user-context";
import { useActiveCourses } from "../../../app-context/active-courses-context";
import useGenericController from "../../../api-controllers/generic-controller-hook";
import useUserController from "../../../api-controllers/user-controller-hook";
import ProfileImgDialog from "../../../Components/DialogBoxes/ProfileImgDialog";

const ClientProfilePage = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { updatePersonalInfo, updateHCP, updateEmail, updateProfileImg } = useAuth();
    const { onboardingCourseSearch } = useCourseController();
    const { updateHomeClub, updatePassword } = useUserController();
    const { userHomeClub, setUserHomeClub } = useActiveCourses();
    const homeClub = userHomeClub();
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
	const [showProfileImgModal, setShowProfileImgModal] = useState(false);
	const [displayMsg, setDisplayMsg] = useState("");
    const [confirmDialogEvtName, setConfirmDialogEvtName] = useState(null);
    const [updatedPersonalInfo, setUpdatedPersonalInfo] = useState(null);
    const [updatedHomeClub, setUpdatedHomeClub] = useState(null);
    const [hcp, setHCP] = useState(null);
    const [pwDetails, setPwDetails] = useState(null);
    const [emailDetails, setEmailDetails] = useState(null);
    const [imgFile, setImgFile] = useState(null);

    const emailRef = useRef();
    
    const {
        register: hcpRegister,
        handleSubmit: hcpHandleSubmit,
        setValue: hcpSetValue,
        formState: { errors: hcp_errors },
    } = useForm({resolver: yupResolver(hcp_schema)});
    
    const {
        handleSubmit: hcHandleSubmit,
        control,
        setValue: hcSetValue,
        formState: { errors },
    } = useForm({});
    
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
        if(!user || cryptoHelper.decryptData(user.mode) === '0'){
            navigate("/");
        }

        if(user){
            hcpSetValue('hcp', user.hcp);
            hcSetValue('home_club', ({label: homeClub.name, value: homeClub}));
        }
        return () => {
            // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
            controllerRef.current.abort();
        };
    }, [location.pathname]);

    const asyncCourseSearch = async (inputValue, callback) => {
        /*  refs: https://stackoverflow.com/questions/65963103/how-can-i-setup-react-select-to-work-correctly-with-server-side-data-by-using  */
        try {
            setNetworkRequest(true);
            resetAbortController();
            const response = await onboardingCourseSearch(controllerRef.current.signal, {inputValue});
            const results = response.data.map(course => ({label: course.name, value: course}));
            setCourseOptions(results);
            setNetworkRequest(false);
            callback(results);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

	const handleCloseProfileModal = () => {
        setShowClientProfileModal(false);
    };

	const handleCloseProfileImgModal = () => {
        setShowProfileImgModal(false);
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
            case "homeClub":
                saveHomeClub();
                break;
            case "hcp":
                saveHCP();
                break;
            case "pw":
                updatePass();
                break;
            case "email":
                updateMail();
                break;
            case "dp":
                updateDP();
                break;
        }
    };

    const handleImgUpdate = async (file) => {
        setImgFile(file);
        setDisplayMsg("Update Profile image?");
        setConfirmDialogEvtName('dp');
        setShowConfirmModal(true);
    };

    const updateInfo = async (data) => {
        setUpdatedPersonalInfo(data);
        setDisplayMsg("Update personal information?");
        setConfirmDialogEvtName('personalInfo');
        setShowConfirmModal(true);
    };

    const updateHC = async (data) => {
        setUpdatedHomeClub(data.home_club.value);
        setDisplayMsg(`Update home club from ${homeClub.name} to ${data.home_club.value.name}?`);
        setConfirmDialogEvtName('homeClub');
        setShowConfirmModal(true);
    };

    const updateHCPIndex = async (data) => {
        setHCP(data.hcp);
        setDisplayMsg(`Update HCP?`);
        setConfirmDialogEvtName('hcp');
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
                dob: updatedPersonalInfo.dob,
                fname: updatedPersonalInfo.fname,
                lname: updatedPersonalInfo.lname,
                gender: updatedPersonalInfo.sex.value
            }
            await updatePersonalInfo(controllerRef.current.signal, temp);
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

    const saveHCP = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            await updateHCP(controllerRef.current.signal, { hcp });
            toast.info('HCP updated successfully');
            setHCP(null);
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

    const saveHomeClub = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            await updateHomeClub(controllerRef.current.signal, {id: updatedHomeClub.id});
            setUserHomeClub(updatedHomeClub);
            toast.info('Home Club updated successfully');
            setUpdatedHomeClub(null);
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
            await updateEmail(controllerRef.current.signal, {otp: emailDetails.otp, email: emailRef.current.value});
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

    const updateDP = async () => {
        try {
            setNetworkRequest(true);
            resetAbortController();
            let formData = new FormData();
            formData.append('img', imgFile);
            await updateProfileImg(controllerRef.current.signal, formData);
            setShowProfileImgModal(false);
            setNetworkRequest(false);
            toast.info("Profile Image update successful");
            setImgFile(null);
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
            <Row className='mt-4'>
                <div className="d-flex flex-wrap gap-4 align-items-center justify-content-center col-md-6 col-sm-12" >
                    {user.blur && <ImageComponent image={user.blur} width={'200px'} height={'200px'} round={true} key_id={user.blur?.key_hash} />}
                    {!user.blur && <img src={IMAGES.member_icon} alt ="Avatar" className="rounded-circle" width={200} height={200} />}
                    <div className="d-flex flex-column gap-3 align-items-center">
                        <Button variant="primary" onClick={() => setShowProfileImgModal(true)}>Upload new photo</Button>
                        <p className="fw-bold">Upload an image not more than <span className="text-danger">5MB</span></p>
                    </div>
                </div>
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
                    <label className="form-label">Date Of Birth</label>
                    <div className="input-group d-flex gap-2 align-items-center">
                        <label className="h5">{user?.dob}</label>
                    </div>
                </Col>
                <Col xs={12} md={3} sm={12} className="mb-2 my-2 g-3 ps-3">
                    <label className="form-label">Gender</label>
                    <div className="input-group d-flex gap-2 align-items-center">
                        <label className="h5">{user?.sex === 'M' ? "Male" : 'Female'}</label>
                    </div>
                </Col>
            </Row>

            <Row className="mt-3 rounded-3 h-100 mb-5">
                <div className="d-flex justify-content-between p-3">
                    <h4 className="fw-bold">Game</h4>
                </div>
                <Col xs={12} md={6} sm={12} className="mb-2 my-2 g-3 p-3 col">
                    <label className="form-label">Home Club</label>
                    <div className="row d-flex gy-3">
                        <div className="col-md-8 col-sm-12">
                            <Controller
                                name="home_club"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <RiBuildingLine size={18} />
                                        </span>
                                        <AsyncSelect
                                            name="home_club"
                                            className="text-dark form-control"
                                            isClearable
                                            placeholder="Search..."
                                            getOptionValue={(option) => option}
                                            defaultOptions={courseOptions}
                                            cacheOptions
                                            loadOptions={asyncCourseSearch}
                                            value={value}
                                            onChange={(val) => onChange(val) }
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        <span className="col-md-4 col-sm-12 d-flex">
                            <Button className="w-100" variant="success" onClick={hcHandleSubmit(updateHC)} disabled={networkRequest}>
                                {!networkRequest && 'Save Changes'}
                                {networkRequest && <ThreeDotLoading color="#ffffff" size="small" />}
                            </Button>
                        </span>
                    </div>
                </Col>
                <Col xs={12} md={6} sm={12} className="mb-2 my-2 g-3 ps-3 col shadow p-3">
                    <label className="form-label">HCP</label>
                    <div className="row d-flex gy-3 align-items-center">
                        <div className="col-md-8 col-sm-12">
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <RiGolfBallLine size={18} />
                                </span>
                                <Form.Control
                                    type="number"
                                    placeholder="e.g., 12.5"
                                    {...hcpRegister("hcp")}
                                />
                            </div>
                        </div>
                        <span className="col-md-4 col-sm-12 d-flex">
                            <Button className="w-100" variant="primary" onClick={hcpHandleSubmit(updateHCPIndex)}>
                                {!networkRequest && 'Update HCP'}
                                {networkRequest && <ThreeDotLoading color="#ffffff" size="small" />}
                            </Button>
                        </span>
                        <ErrorMessage source={hcp_errors.hcp} />
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
			<ClientProfileDialog
				show={showClientProfileModal}
				handleClose={handleCloseProfileModal}
				handleConfirm={updateInfo}
				networkRequest={networkRequest}
			/>
			<ProfileImgDialog
				show={showProfileImgModal}
				handleClose={handleCloseProfileImgModal}
				handleConfirm={handleImgUpdate}
				networkRequest={networkRequest}
			/>
        </section>
    )
}

export default ClientProfilePage;