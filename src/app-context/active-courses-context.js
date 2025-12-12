import { createContext, useContext, useMemo, useState } from "react";

const ActiveCoursesContext = createContext();

/*ref:  https://blog.logrocket.com/authentication-react-router-v6/
        https://blog.logrocket.com/react-context-tutorial/
*/
export const ActiveCoursesProvider = ({ children }) => {
    const [ activeCourses, setActiveCourses ] = useState([]);
	const [coursesLoading, setCoursesLoading] = useState(true);
    
    const courses = () => {
        return activeCourses;
    };
    
    const setCourses = (courses) => {
        setActiveCourses(courses);
    };
    
    const loadingCourses = () => {
        return coursesLoading;
    };
    
    const setLoadingCourses = (val) => {
        setCoursesLoading(val);
    };

    const value = useMemo(
        () => ({
            courses,
            setCourses,
            loadingCourses,
            setLoadingCourses,
        }),
        [activeCourses, coursesLoading]
    );

    return <ActiveCoursesContext.Provider value={value}>{children}</ActiveCoursesContext.Provider>;
}

export const useActiveCourses = () => useContext(ActiveCoursesContext);