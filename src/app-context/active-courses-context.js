import { createContext, useContext, useMemo, useState } from "react";

const ActiveCoursesContext = createContext();

/*ref:  https://blog.logrocket.com/authentication-react-router-v6/
        https://blog.logrocket.com/react-context-tutorial/
*/
export const ActiveCoursesProvider = ({ children }) => {
    const [ activeCourses, setActiveCourses ] = useState([]);
    const [ coursesHolesContests, setCousesHolesContests ] = useState({});
	const [coursesLoading, setCoursesLoading] = useState(true);
	const [homeClub, setHomeClub] = useState({});   //  storing user home club
    
    const courses = () => {
        return activeCourses;
    };
    
    const setCourses = (courses) => {
        setActiveCourses(courses);
    };
    
    const courseHolesContests = (course_id) => {
        return coursesHolesContests[course_id];
    };
    
    const updateCoursesHolesContests = (val) => {
        const temp = {...coursesHolesContests};
        temp[val.id] = {id: val.id, holes: val.holes};
        setCousesHolesContests(temp);
    };
    
    const loading = () => {
        return coursesLoading;
    };
    
    const setLoading = (val) => {
        setCoursesLoading(val);
    };
    
    const userHomeClub = () => {
        return homeClub;
    };
    
    const setUserHomeClub = (val) => {
        setHomeClub(val);
    };

    const value = useMemo(
        () => ({
            courses,
            setCourses,
            loading,
            setLoading,
            courseHolesContests,
            updateCoursesHolesContests,
            userHomeClub,
            setUserHomeClub,
        }),
        [activeCourses, coursesLoading, coursesHolesContests, homeClub]
    );

    return <ActiveCoursesContext.Provider value={value}>{children}</ActiveCoursesContext.Provider>;
}

export const useActiveCourses = () => useContext(ActiveCoursesContext);