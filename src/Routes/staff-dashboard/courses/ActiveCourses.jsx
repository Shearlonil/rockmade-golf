import { useEffect, useRef, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Select from 'react-select';

import IMAGES from "../../../assets/images";
import { useAuthUser } from "../../../app-context/user-context";

const ActiveCourses = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { authUser } = useAuthUser();
    const user = authUser();

    const [courseOptions, setCourseOptions] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(true);
    
    useEffect(() => {
        if(!user || !user.authorities || user.authorities.length === 0){
            navigate("/");
        }

        // initialize();
        return () => {
            // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
            controllerRef.current.abort();
        };
    }, [location.pathname]);

    const courseChange = (val) => {};

    return (
        <section className='container d-flex flex-column gap-4' style={{minHeight: '60vh'}}>
            <Row className='d-flex align-items-center'>
                <div className="d-flex flex-wrap gap-4 align-items-center col-12 col-md-10 mt-4" >
                    <img src={IMAGES.image1} alt ="Avatar" className="rounded-circle" width={100} height={100} />
                    <div className="d-flex flex-wrap gap-2 fw-bold h2">
                        <span>{user.firstName}</span>
                        <span> {user.lastName}</span>
                    </div>
                </div>
                <div className=" col-12 col-md-2 mt-4">
                    <Button variant="success fw-bold" className="w-100">Add</Button>
                </div>
            </Row>
            <Row className="card shadow border-0 rounded-3">
                <div className="card-body d-flex justify-content-between flex-wrap gap-3">
                    <div className="d-flex gap-3 align-items-center">
                        <img src={IMAGES.golf_course} alt ="Avatar" className="rounded-circle" width={50} height={50} />
                        <span className="text-danger fw-bold h2">Golf Courses</span>
                    </div>

                    <div className="d-flex gap-3 align-items-center">
                        <Select
                            required
                            name="golf_course"
                            placeholder="Search Golf courses..."
                            className="text-dark"
                            isLoading={coursesLoading}
                            options={courseOptions}
                            onChange={(val) => { courseChange(val) }}
                        />
                    </div>

                    <div className="d-flex gap-3 align-items-center">
                        <Select
                            required
                            name="filter"
                            placeholder="Filter..."
                            className="text-dark"
                            isLoading={coursesLoading}
                            options={courseOptions}
                            onChange={(val) => { courseChange(val) }}
                        />
                    </div>
                </div>
            </Row>
        </section>
    )
}

export default ActiveCourses;