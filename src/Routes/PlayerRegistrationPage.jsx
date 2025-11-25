import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
    RiUserLine,
    RiMailLine,
    RiCalendarLine,
    RiBuildingLine,
    RiGolfBallLine,
    RiEyeLine,
    RiLockLine,
    RiEyeOffLine,
} from "react-icons/ri";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import Select from "react-select";
import Datetime from "react-datetime";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from "react-toastify";

import IMAGES from "../assets/images";
import DpUploader from '../Components/DpUploader';
import { schema, emailSchema } from "../Utils/yup-schema-validator/user-form-schema";
import ErrorMessage from "../Components/ErrorMessage";
import { gender } from "../Utils/data";
import handleErrMsg from "../Utils/error-handler";
import { ThreeDotLoading } from "../Components/react-loading-indicators/Indicator";
import { useAuthUser } from "../app-context/user-context";
import useGenericController from '../api-controllers/generic-controller-hook';
import useUserController from "../api-controllers/user-controller-hook";

const PlayerRegistrationPage = () => {
    const navigate = useNavigate();
    const controllerRef = useRef(new AbortController());
    
    const { performGetRequests, requestOTP } = useGenericController();
    const { onboard } = useUserController();
    const { authUser } = useAuthUser();
    const user = authUser();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			fname: "",
            lname: "",
            email: "",
            gender: "",
            hcp: "",
            country: null,
            hc_id: null,
			dob: null,
		},
	});

    const [dp, setDp] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [networkRequest, setNetworkRequest] = useState(false);

    const emailRef = useRef();

	// for countries
	const [countryOptions, setCountryOptions] = useState([]);
	const [countrysLoading, setCountrysLoading] = useState(true);
	// for courses
	const [courseOptions, setCourseOptions] = useState([]);
	const [coursesLoading, setCoursesLoading] = useState(true);
    
    useEffect(() => {
        initialize();

        if (user) {
          navigate("/dashboard");
        }

        return () => {
            // This cleanup function runs when the component unmounts
            // or when the dependencies of useEffect change (e.g., route change)
            controllerRef.current.abort();
        };
    }, [])

    const initialize = async () => {
        try {
            // Cancel any previous in-flight request
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
            controllerRef.current = new AbortController();
            const urls = [ '/countries/active/all', '/courses/onboarding/active/all' ];
            const response = await performGetRequests(urls, controllerRef.current.signal);
            const { 0: countriesRequest, 1: coursesRequest } = response;

            //	check if the request to fetch pkg doesn't fail before setting values to display
            if(countriesRequest){
                setCountrysLoading(false);
                setCountryOptions(countriesRequest.data.map( country => ({label: country.name, value: country})));
            }

            //	check if the request to fetch vendors doesn't fail before setting values to display
            if(coursesRequest){
                setCoursesLoading(false);
                setCourseOptions(coursesRequest.data.map( course => ({label: course.name, value: course})));
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            toast.error(handleErrMsg(error).msg);
        }
    };

    const setImageURL = (file) => {
        setDp(file);
    }

    const verifyEmail = async () => {
        // validate email
        try {
            setNetworkRequest(true);
            emailSchema.validateSync(emailRef.current.value);
			toast.info(`sending OTP to ${emailRef.current.value}.`);
            await requestOTP(emailRef.current.value);
			toast.info(`OTP sent to ${emailRef.current.email}. If not found in your inbox, please check you spam`);
            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error.message).msg);
        }
    };

    const onSubmit = async (data) => {
        // validate email
        try {
            emailSchema.validateSync(emailRef.current.value);
        } catch (error) {
            toast.error(handleErrMsg(error.message).msg);
        }

        // on successful email validation, engage server side
        try {
            // Cancel previous request if it exists
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
            controllerRef.current = new AbortController();
            setNetworkRequest(true);
            data.email = emailRef.current.value;
            data.file = dp;
            await onboard(controllerRef.current.signal, data);
            setNetworkRequest(false);
            navigate("/memberships");
        } catch (error) {
            if (error.name === 'AbortError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    return (
        <section className="position-relative min-vh-100 d-flex align-items-center justify-content-center" style={{ paddingTop: "80px" }} >
            <div className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    backgroundImage: `url(${IMAGES.image1 || "https://images.unsplash.com/photo-1587174484923-2d0ace49f1a9?q=80&w=2070"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(0.6)",
                }}
            ></div>
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

            <div className="position-relative container">
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card border-0 shadow-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", }}>
                            <div className="card-body p-5 d-flex flex-column align-items-center">
                                <div className="text-center">
                                    <img src={IMAGES.logo} className="text-primary mb-3" width={98} />
                                    <h2 className="fw-bold mb-1">
                                        Join the Fairway <span className="word-span">Family</span>
                                    </h2>
                                    <p className="text-muted">
                                        Complete your player profile to start competing
                                    </p>
                                </div>


                                <Form>
                                    <div className="d-flex justify-content-center w-100 mb-4">
                                        <DpUploader setImageURL={setImageURL} />
                                    </div>

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

                                    <div className="d-flex flex-column mb-3">
                                        <div className="row g-3">
                                            <div className="col-md-8">
                                                <label className="form-label fw-bold">Email</label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <RiMailLine size={18} />
                                                    </span>
                                                    <input
                                                        type="text"
                                                        placeholder="john@example.com"
                                                        className="form-control"
                                                        // {...register("email")}
                                                        ref={emailRef}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 d-flex align-items-end justify-content-end">
                                                <Button type="button" className="btn btn-primary w-100 fw-bold" onClick={() => verifyEmail()}>
                                                    {!networkRequest && <span><IoShieldCheckmarkSharp className="me-2" /> Verify</span>}
                                                    {networkRequest && <ThreeDotLoading color="#ffffff" size="small" />}
                                                </Button>
                                            </div>
                                        </div>
                                        <ErrorMessage source={errors.email} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">OTP</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light">
                                                <RiUserLine size={18} />
                                            </span>
                                            <Form.Control
                                                type="text"
                                                placeholder="enter otp sent to email for verification"
                                                {...register("otp")}
                                            />
                                        </div>
                                        <ErrorMessage source={errors.otp} />
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light">
                                                <RiLockLine size={18} />
                                            </span>
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create a password"
                                                {...register("pw")}
                                            />
                                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)} >
                                                {showPassword ? (
                                                    <RiEyeOffLine size={18} />
                                                ) : (
                                                    <RiEyeLine size={18} />
                                                )}
                                            </button>
                                        </div>
                                        <ErrorMessage source={errors.pw} />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold">
                                            Confirm Password
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light">
                                                <RiLockLine size={18} />
                                            </span>
                                            <Form.Control
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm your password"
                                                {...register("confirm_pw")}
                                            />
                                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword) }>
                                                {showConfirmPassword ? (
                                                    <RiEyeOffLine size={18} />
                                                ) : (
                                                    <RiEyeLine size={18} />
                                                )}
                                            </button>
                                        </div>
                                        <ErrorMessage source={errors.confirm_pw} />
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">
                                                Date of Birth
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
                                                        placeholder="Select Gender..."
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
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">
                                                Handicap Index
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light">
                                                    <RiGolfBallLine size={18} />
                                                </span>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="e.g., 12.5"
                                                    {...register("hcp")}
                                                />
                                            </div>
                                            <ErrorMessage source={errors.hcp} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Country</label>
                                            <Controller
                                                name="country"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Select
                                                        required
                                                        name="country"
                                                        placeholder="Select Item..."
                                                        className="text-dark col-12"
                                                        options={countryOptions}
                                                        isLoading={countrysLoading}
                                                        onChange={(val) => onChange(val)}
                                                        value={value}
                                                    />
                                                )}
                                            />
                                            <ErrorMessage source={errors.country} />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Home Club</label>
                                        <Controller
                                            name="home_club"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <RiBuildingLine size={18} />
                                                    </span>
                                                    <Select
                                                        required
                                                        name="home_club"
                                                        placeholder="Select Home Club..."
                                                        className="text-dark form-control"
                                                        options={courseOptions}
                                                        isLoading={coursesLoading}
                                                        onChange={(val) => onChange(val)}
                                                        value={value}
                                                    />
                                                </div>
                                            )}
                                        />
                                        <ErrorMessage source={errors.home_club} />
                                    </div>

                                    <Button type="submit" className="btn custom-btn w-100 mb-3" onClick={handleSubmit(onSubmit)}>
                                        {!networkRequest && <span><IoShieldCheckmarkSharp className="me-2" /> Register </span>}
                                        {networkRequest && <ThreeDotLoading color="#ffffff" size="small" />}
                                    </Button>

                                    <div className="text-center">
                                        <p className="mb-0 text-muted small">
                                            Already registered?{" "}
                                            <a className="fw-bold text-primary" onClick={() => navigate('/login')}>
                                                Sign In
                                            </a>
                                        </p>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PlayerRegistrationPage;
