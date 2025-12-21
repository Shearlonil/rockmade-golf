import { useEffect, useRef } from "react";
import { Button, Row } from "react-bootstrap";
import { useAuthUser } from "../../../app-context/user-context";
import { useLocation, useNavigate } from "react-router-dom";

import IMAGES from "../../../assets/images";
import ImageComponent from "../../../Components/ImageComponent";
import cryptoHelper from "../../../Utils/crypto-helper";

const ClientProfilePage = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { authUser } = useAuthUser();
    const user = authUser();
    
    useEffect(() => {
        if(!user || cryptoHelper.decryptData(user.mode) === '0'){
            navigate("/");
        }

        return () => {
            // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
            controllerRef.current.abort();
        };
    }, [location.pathname]);

    return (
        <section className='container' style={{minHeight: '60vh'}}>
            <Row className="mt-5 ms-2">
                <h2>Edit Profile</h2>
            </Row>
            <Row className='mt-4'>
                <div className="d-flex flex-wrap gap-4 align-items-center justify-content-center col-md-6 col-sm-12" >
                    {user.blur && <ImageComponent image={user.blur} width={'200px'} height={'200px'} round={true} />}
                    {!user.blur && <img src={IMAGES.member_icon} alt ="Avatar" className="rounded-circle" width={200} height={200} />}
                    <Button variant="primary">Upload new photo</Button>
                </div>
            </Row>
        </section>
    )
}

export default ClientProfilePage;