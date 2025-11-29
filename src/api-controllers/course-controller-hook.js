import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useCourseController = () => {
    const { xhrAios } = useAxiosInterceptor();
    
    const finById = async (signal, id) => {
        return await xhrAios.get(`/courses/search/${id}`, {signal});
    }
    
    const fetchAllActive = async (signal) => {
        return await xhrAios.get(`/courses/active/all`, {signal});
    }
    
    const createCourse = async (signal, data) => {
        return await xhrAios.post(`/courses/create`, data, {signal});
    }
    
    const updateCourseHoleCount = async (signal, data) => {
        return await xhrAios.post(`/courses/holes/update`, data, {signal});
    }
    
    const updateCourse = async (signal, data) => {
        return await xhrAios.post(`/courses/update`, data, {signal});
    }
    
    const status = async (signal, data) => {
        return await xhrAios.post(`/courses/status`, data, {signal});
    }

    return {
        finById,
        fetchAllActive,
        createCourse,
        updateCourseHoleCount,
        updateCourse,
        status,
    }
}

export default useCourseController;