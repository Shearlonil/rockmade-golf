import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Loader } from 'rsuite';
import { useLocation, useNavigate, useParams } from "react-router-dom";

import IMAGES from "../assets/images";
import { useAuthUser } from "../app-context/user-context";
import handleErrMsg from "../Utils/error-handler";
import { useAuth } from "../app-context/auth-context";
import useUserController from "../api-controllers/user-controller-hook";

const PaystackTransactionVerification = () => {
    const controllerRef = useRef(new AbortController());

    const navigate = useNavigate();
    const location = useLocation();
    const { reference } = useParams();

    const { verifySubTransaction } = useAuth();
    /*  For some unclear reasons, updateEmail and updateStaffEmail methods do not attach Authorization header to the request header. Miraculously, simply importing any controller
        even without using a mehtod in it solves this problem
    */
    const { getAxios } = useUserController();
    const { authUser } = useAuthUser();
    const user = authUser();

    useEffect(() => {
        if (user) {
            if(!reference){
                toast.error('Unexpected Error occured');
                navigate("/");
                return;
            }
          initialize();
        }else {
            navigate('/login');
        }
    }, [location.pathname]);
    
    const initialize = async () => {
        try {
            console.log(reference);
            await verifySubTransaction(controllerRef.current.signal, reference);
            // navigate('/dashboard');
        } catch (error) {
            console.log(error);
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            toast.error(handleErrMsg(error).msg);
        }
    };

    return (
        <section  className="position-relative min-vh-100 d-flex align-items-center justify-content-center" >
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
                                <div className="text-center">
                                    <img src={IMAGES.logo} className="text-primary mb-3" width={98} />
                                    <h2 className="fw-bold mb-3">Verifying Transaction</h2>
                                    <Loader content="Please Wait..." size="md" vertical />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PaystackTransactionVerification;