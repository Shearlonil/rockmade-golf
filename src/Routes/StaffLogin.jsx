import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    RiMailLine,
    RiLockLine,
    RiEyeLine,
    RiEyeOffLine,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";

import IMAGES from "../assets/images";
import { useAuth } from "../app-context/auth-user-context";
import ErrorMessage from '../Components/ErrorMessage';
import { ThreeDotLoading } from "../Components/react-loading-indicators/Indicator";
import handleErrMsg from '../Utils/error-handler';

const StaffLogin = () => {
    const navigate = useNavigate();

    const { staffLogin, authUser } = useAuth();
    const user = authUser();

    const [showPassword, setShowPassword] = useState(false);

	const [isLoggingIn, setIsLoggingIn] = useState(false);

	const schema = yup.object().shape({
		email: yup
			.string()
			.email("A valid email format is required")
			.required("Email is required"),
		pw: yup
			.string()
			.min(6, "Password must be a min of 6 characters!")
			.required("Input correct password"),
	});

    // Yup Integration with "react-hook-form"
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (user) {
          navigate("/dashboard");
        }
    }, []);

    const onSubmit = async (data) => {
        try {
            setIsLoggingIn(true);
            await staffLogin(data);
            setIsLoggingIn(false);
            navigate("/staff/dashboard");
        } catch (ex) {
            setIsLoggingIn(false);
            toast.error(handleErrMsg(ex).msg);
        }
    };

    return (
        <section  className="position-relative min-vh-100 d-flex align-items-center justify-content-center" style={{ paddingTop: "80px" }} >
            <div className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    backgroundImage: `url(${IMAGES.image1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(0.6)",
                }}
            ></div>
            {/* dark overlay for background picture */}
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50 text-white"></div>

            <div className="position-relative container">
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="row justify-content-center" >
                    <div className="col-12 col-md-6 col-lg-5">
                        <div className="card border-0 shadow-lg"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              backdropFilter: "blur(10px)",
                            }}
                        >
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <img src={IMAGES.logo} className="text-primary mb-3" width={98} />
                                    <h2 className="fw-bold mb-1">Welcome Back</h2>
                                    <p className="text-muted fw-bold">
                                        Sign in to your account as a staff
                                    </p>
                                </div>

                                <Form>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Email Address</label>
                                        <div className="input-group mb-1">
                                            <span className="input-group-text bg-light">
                                                <RiMailLine size={18} />
                                            </span>
                                            <input 
                                                type="email" 
                                                className="form-control"  
                                                placeholder="Enter your email"
                                                {...register("email")}
                                            />
                                        </div>
								        <ErrorMessage source={errors.email} />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Password</label>
                                        <div className="input-group mb-1">
                                            <span className="input-group-text bg-light">
                                                <RiLockLine size={18} />
                                            </span>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                placeholder="Enter your password"
                                                {...register("pw")}
                                            />
                                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}  >
                                                {showPassword ? (
                                                    <RiEyeOffLine size={18} />
                                                ) : (
                                                    <RiEyeLine size={18} />
                                                )}
                                            </button>
                                        </div>
								        <ErrorMessage source={errors.pw} />
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <a className="text-primary text-decoration-none small" >
                                            Forgot Password?
                                        </a>
                                    </div>

                                    <Button type="submit" className="btn custom-btn w-100 mb-3" onClick={handleSubmit(onSubmit)} disabled={isLoggingIn}>
                                        { isLoggingIn && <ThreeDotLoading color="#fbfafaff" size="medium" textColor="#f78419" /> }
                                        {!isLoggingIn && `Sign In` }
                                    </Button>

                                    <div className="text-center">
                                        <p className="mb-0 text-muted small">
                                            Don't have an account?{" "}
                                            <a className="text-primary fw-bold" onClick={() => navigate('/register')}>
                                                Sign Up
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

export default StaffLogin;
