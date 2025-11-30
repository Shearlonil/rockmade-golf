import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useCourseController = () => {
    const { xhrAios } = useAxiosInterceptor();
    
    const finById = async (signal, id) => {
        return await xhrAios.get(`/courses/search/${id}`, {signal});
    }
    
    const courseSearch = async (signal, data) => {
        return await xhrAios.get(`/courses/query`, {
            params: {
                str: data.inputValue, status: data.courseStatus
            }
        }, {signal});
    }
    
    const fetchAllActive = async (signal) => {
        return await xhrAios.get(`/courses/active/all`, {signal});
    }
    
    const activeCoursesPageInit = async (signal, pageSize) => {
        return await xhrAios.get(`/courses/active/init/${pageSize}`, {signal});
    }
    
    const paginateFetch = async (signal, data) => {
        return await xhrAios.get(`/courses/search/page/${data.page}`, {
            params: {
                pageSize: data.pageSize, status: data.courseStatus, page: data.page
            }
        }, {signal});
    }
    
    const createCourse = async (signal, data) => {
        return await xhrAios.post(`/courses/create`, data, {signal});
    }
    
    // for changing number of holes in a course. Either was 18 and now updating to 9 holes or was 9 and now updating to 18
    const updateCourseHoleCount = async (signal, data) => {
        return await xhrAios.post(`/courses/holes/update`, data, {signal});
    }
    
    // for updating values (par and hcp) of a hole in a course
    const updateCourseHole = async (signal, data) => {
        return await xhrAios.post(`/courses/hole/update`, data, {signal});
    }
    
    const updateCourse = async (signal, data) => {
        return await xhrAios.post(`/courses/update`, data, {signal});
    }
    
    const status = async (signal, data) => {
        return await xhrAios.put(`/courses/status`, data, {signal});
    }

    return {
        finById,
        fetchAllActive,
        activeCoursesPageInit,
        paginateFetch,
        createCourse,
        updateCourseHoleCount,
        updateCourseHole,
        updateCourse,
        courseSearch,
        status,
    }
}

export default useCourseController;