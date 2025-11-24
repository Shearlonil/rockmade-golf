import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TrashedCourses = () => {
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <div>TrashedCourses</div>
    )
}

export default TrashedCourses;